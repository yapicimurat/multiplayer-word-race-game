import "./game.css";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {SOCKET} from "../../config";
import {text as drawText, clear} from "../../util/draw";

export default function GameScreen() {

    const {socket, room, nickName } = useSelector(state => state.playerReducer);
    const [isReady, setIsReady] = useState(false);
    const [context, setContext] = useState(null);
    const gameAreaRef = useRef();
    const dispatch = useDispatch();

    const getReady = () => {

        socket.emit(SOCKET.EMIT_EVENTS.SERVER_PLAYER_READY, {
            nickName: nickName
        });

        setIsReady(true);
    };


    const drawTextToGame = (text, x, y, color, font) => {
        if(context)
        {
            drawText(context, text, x, y, color, font);
        }

    };

    const getContext = (canvas) => {
        if(canvas != null) {
            const context = canvas.getContext("2d");

            setContext(context);
        }
    };

    //reload per each signal from the server
    useEffect(() => {

        //DRAWS...
        if(room?.game) {
            if(context !== null) {
                clear(context, 800, 600);

                if(room.game.totalTimeInSeconds > 0) {
                    //game is contiuning..

                    if(Array.isArray(room.game.currentWordList) && room.game.currentWordList.length > 0) {
                        room.game.currentWordList.forEach(currentWord => {
                            drawTextToGame(currentWord.val, currentWord.x, currentWord.y, currentWord.color, currentWord.fontSize);
                        });
                    }

                    //draw score
                    const score = room.users.filter(user => user.socketId === socket.id)[0].score;
                    drawTextToGame("Your Score: " + score, 10, 20, "#fff", "12px Arial");

                }else {
                    //finish
                }

                //game countdown
                drawTextToGame(`Time: ${room.game.totalTimeInSeconds}`, 725, 20, "white", "12px Arial");
            }


        }
    }, [room]);

    return (
        <div className="screen">
            {
                (room?.game.isStarted === false) ?
                    <>
                        <div className="container text-center">
                            <p>Ready State: {room.users.filter(user => user.isReady === true).length}/{room.users.length}</p>
                            {(!isReady) ? (
                                <button className="btn btn-success m-1" onClick={getReady}>Set Ready</button>
                            ) : null}

                            <p>
                                {
                                    (room.users.length > 1) ? "In " + room.countdownToStartInSecond
                                        + " second(s) game will be start" :
                                        "Wait for more 1 player"
                                }
                            </p>

                            <ul className="list-group">
                                <h4>Participant List ({room.users.length})</h4>
                                {
                                    room.users.map((user, index) => (
                                        <li className="list-group-item" key={index}>{user.nickName}</li>
                                    ))
                                }
                            </ul>
                        </div>

                    </>
                    : (
                        <>
                            <canvas width="800" height="600" id="gameArea" ref={getContext}></canvas>
                        </>

                    )
            }
        </div>
    );
}

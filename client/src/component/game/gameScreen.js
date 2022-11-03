import "./game.css";
import {useSelector} from "react-redux";


export default function GameScreen(){

    const {socket, room, nickName } = useSelector(state => state.playerReducer);

    return (
        <div className="screen">
            {
                (room?.game.isStarted === false) ?
                    <>
                        <button className="readyButton">Ready</button>
                        <small id="countDown">
                            {
                                (room.users.length > 1) ? "In " + room.countdownToStartInSecond
                                    + " second(s) game will be start" :
                                    "Wait for more 1 player"
                            }
                        </small>
                    </>
                    : null
            }
        </div>
    );
}

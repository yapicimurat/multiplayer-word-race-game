import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {SOCKET} from "../config";

export default function Footer() {
    const [word, setWord] = useState("");
    const {socket, room, nickName } = useSelector(state => state.playerReducer);
    //word list

    const type = (e) => {
        setWord(e.target.value);
    }

    const completeWord = (e) => {
        if(e.keyCode === 13) {
            //enter key code
            if(room?.game && socket && socket.connected) {

                if(room.game.totalTimeInSeconds > 0) {
                    if(room.game.currentWordList.length > 0) {

                        if(room.game.currentWordList.some(currentWord => currentWord.val === word)) {
                            //send complete word signal
                            socket.emit(SOCKET.EMIT_EVENTS.SERVER_COMPLETE_WORD, {
                                word,
                                roomName: room.name
                            });

                            setWord("");
                        } else {
                            //incorrect attempt...
                        }

                    }else {

                    }
                } else {
                    alert("game is end");
                }

            }

        }
    }

    /*
        useEffect(() => {



        }, [word]);
    */

    if(room?.game) {
        return (
            <footer style={{padding: "10px 20px"}}>
                <label style={{textAlign: "center"}}>Type what you can see!!! Press enter to complete the word.</label>
                <input type="text" id="word" name="word" value={word} onChange={type}
                       style={{width: "100%", height: "40px"}} onKeyDown={completeWord}/>
            </footer>
        );
    } else {
        return (
            <p>The game is not started yet...</p>
        );
    }


}

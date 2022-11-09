import "./game.css";
import {useSelector} from "react-redux";


export default function GameScreen(){

    const {socket, room, nickName } = useSelector(state => state.playerReducer);



    const getReady = () => {

        console.log("tıklandı....");

    };

    return (
        <div className="screen">
            {
                (room?.game.isStarted === false) ?
                    <>
                        <small className="participants">Participants: {room.users.length}</small>
                        <small id="readyState">Ready State: {room.users.filter(user => user.isReady === true).length}/{room.users.length}</small>
                        <button className="readyButton">Ready</button>
                        <small id="countDown">
                            {
                                (room.users.length > 1) ? "In " + room.countdownToStartInSecond
                                    + " second(s) game will be start" :
                                    "Wait for more 1 player"
                            }
                        </small>

                        <ul className="participantList">
                            <h4>Participant List</h4>
                            {
                                room.users.map((user, index) => (
                                    <li key={index}>{user.nickName}</li>
                                ))
                            }
                        </ul>
                    </>
                    : null
            }
        </div>
    );
}

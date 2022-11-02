import {useSelector} from "react-redux";
import {useEffect} from "react";


export default function Header(){

    const {nickName, socket, isInGame, room} = useSelector(state => state.playerReducer);


    const connectedText = (!socket?.connected) ? "Pending..." : "Connected";


    return (
        <header>
            <h2>MULTIPLAYER WORD RACE GAME</h2>
            <small>Complete words faster than others and win the game!!!</small>
            <small className="serverState">State: {connectedText} </small>
            {
                (room !== null) ?
                    <>
                        <small className="serverState">You are in</small>
                        <small className="inGameInformation">{room.name}</small>
                        <small>Creator: {room.creatorPlayer.nickName}</small>
                    </>
                : null
            }
        </header>
    );
}

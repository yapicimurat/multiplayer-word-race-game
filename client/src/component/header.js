import {useSelector} from "react-redux";
import {useEffect} from "react";


export default function Header(){

    const {nickName, socket, isInGame, room} = useSelector(state => state.playerReducer);


    const connectedText = (!socket?.connected) ? "Pending..." : "Connected";


    return (
        <header>
            <h2>MULTIPLAYER WORD RACE GAME</h2>
            <small>Complete words faster than others and win the game!!!</small>
            <small>Status: {connectedText} </small>
            {
                (room !== null) ?
                    <>
                        <span className="serverState">You are in</span>
                        <p className="inGameInformation">{room.name}</p>
                        <p>Creator: {room.creatorPlayer.nickName}</p>
                    </>
                : null
            }
        </header>
    );
}

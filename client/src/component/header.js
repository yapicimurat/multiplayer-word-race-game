import {useSelector} from "react-redux";


export default function Header(){

    const isConnected = useSelector(state => state.playerReducer.socket?.connected);

    const connectedText = (!isConnected) ? "Pending..." : "Connected";


    return (
        <header>
            <h2>MULTIPLAYER WORD RACE GAME</h2>
            <small>Complete words faster than others and win the game!!!</small>
            <small className="serverState">State: {connectedText} </small>
        </header>
    );
}

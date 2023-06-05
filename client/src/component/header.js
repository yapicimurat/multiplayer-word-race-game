import {useSelector} from "react-redux";


export default function Header() {

    const {nickName, socket, isInGame, room} = useSelector(state => state.playerReducer);
    const connectedText = (!socket?.connected) ? "Bekleniyor..." : "Bağlanıldı...";

    return (
        <header>
            <h2>Çok Oyunculu Kelime Yazma Yarış Oyunu</h2>
            <small>Tüm kelimeleri yaz ve diğer kullancıların önüne geç!!!</small>
            <small>Statü: {connectedText} </small>
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

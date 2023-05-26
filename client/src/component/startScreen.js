import CreateRoom from "./room/createRoom.js";
import CreateNickName from "./createNickName";
import RoomList from "./room/roomList.js";
import {useSelector} from "react-redux";
import GameHistory from "./gameHistory";

export default function StartScreen(){

    //get isCreateRoomFormOpen
    const isCreateRoomFormOpen = useSelector(state => state.generalReducer.isCreateRoomFormOpen);

    const logout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "";
    };

    return (
        <div className="screen">
            <div className="d-flex flex-row justify-content-evenly pt-1">
                <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#gameHistoryModal">Geçmiş Oyunlarım</button>
                <button className="btn btn-primary" onClick={logout}>Çıkış Yap</button>
            </div>
            <GameHistory/>
            <hr/>
            <CreateNickName/>
            {(isCreateRoomFormOpen) ? <CreateRoom/> : <RoomList/>}
        </div>
    );
}

import CreateRoom from "./room/createRoom.js";
import CreateNickName from "./createNickName";
import RoomList from "./room/roomList.js";
import {useSelector} from "react-redux";

export default function StartScreen(){

    //get isCreateRoomFormOpen
    const isCreateRoomFormOpen = useSelector(state => state.generalReducer.isCreateRoomFormOpen);


    return (
        <div className="screen">
            <CreateNickName/>
            {(isCreateRoomFormOpen) ? <CreateRoom/> : <RoomList/>}
        </div>
    );
}

import CreateRoom from "./room/createRoom.js";
import CreateNickName from "./createNickName";
import RoomList from "./room/roomList.js";

export default function StartScreen(){
    return (
        <div className="screen">
            <CreateNickName/>
            <RoomList/>
        </div>
    );
}

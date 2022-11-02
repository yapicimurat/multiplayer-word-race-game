import {useSelector} from "react-redux";
import {SOCKET} from "../../config";

export default function RoomItem({creatorNickName, name, capacity, usersCount, date}){

    const socket = useSelector(state => state.playerReducer.socket);

    const joinRoomEvent = () => {
        if(socket && socket.connected){
            if(window.confirm("Do you want to join [" + name + "] room?"))
                socket.emit(SOCKET.EMIT_EVENTS.JOIN_ROOM, {
                    roomName: name,
                    userSocketId: socket.id
                });
        }else{
            alert("An error occurred.");
        }
    };

    return (
        <li className="roomItem">[Player]: <span>{creatorNickName}</span>, [Name]: <span>{name}</span>, [Capacity]: <span>{usersCount + "/" + capacity}</span>, [Time]: <span>{new Date(date).toLocaleTimeString()}</span> <span><button onClick={joinRoomEvent} className="joinRoom">JOIN</button></span></li>
    );
}

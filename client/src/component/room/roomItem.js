import {useSelector} from "react-redux";
import {SOCKET} from "../../config";
import clsx from "clsx";

export default function RoomItem({creatorNickName, name, capacity, usersCount, date}){

    const {socket, nickName} = useSelector(state => state.playerReducer);

    const joinRoomEvent = () => {

        if(nickName === "")
        {
            alert("Firstly, enter your nickname.");
        }else{
            if(socket && socket.connected){
                if(window.confirm("Do you want to join [" + name + "] room?"))
                    socket.emit(SOCKET.EMIT_EVENTS.JOIN_ROOM, {
                        roomName: name,
                        userSocketId: socket.id
                    });
            }else{
                alert("Server error.");
            }
        }
    };

    return (
        <li className={clsx({"full" : (capacity === usersCount)})}>[Player]: <span>{creatorNickName}</span>, [Name]: <span>{name}</span>, [Capacity]: <span>{usersCount + "/" + capacity}</span>, [Time]: <span>{new Date(date).toLocaleTimeString()}</span> <span><button disabled={(capacity === usersCount)} onClick={joinRoomEvent} className="joinRoom">JOIN</button></span></li>
    );
}

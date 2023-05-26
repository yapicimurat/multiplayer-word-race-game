import RoomItem from "./roomItem.js";
import {useSelector} from "react-redux";

export default function RoomList(){

    const roomList = useSelector(state => state.roomReducer.roomList);

    const roomListComponents = roomList.map((room, index) => {
        return <RoomItem
            key={index}
            creatorNickName={room.creatorPlayer.nickName}
            name={room.name}
            capacity={room.capacity}
            usersCount={room.users.length}
            date={room.createdAt}
        />
    });

    return (
        <ul className="roomList">
            {(Array.isArray(roomList) && roomList.length > 0) ? roomListComponents : "Henüz kimse bir oda oluşturmamış..."}
        </ul>
    );
}

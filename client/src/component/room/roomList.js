import RoomItem from "./roomItem.js";
import {useSelector} from "react-redux";

export default function RoomList(){

    const roomList = useSelector(state => state.roomReducer.roomList);




    const roomListComponents = roomList.map((room, index) => {
        console.log(room);
        return <RoomItem
            key={index}
            creatorNickName={room.creatorPlayer.nickName}
            name={room.name}
            capacity={room.capacity}
            date={room.createdAt}
        />
    });



    return (
        <ul className="roomList">
            {(Array.isArray(roomList) && roomList.length > 0) ? roomListComponents : "No any room..."}
        </ul>
    );

}

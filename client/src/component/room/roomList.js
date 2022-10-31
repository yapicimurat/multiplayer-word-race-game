import RoomItem from "./roomItem.js";
import {useSelector} from "react-redux";

export default function RoomList(){

    const roomList = useSelector(state => state.roomReducer.roomList);


    roomList.map((room, index) => {
        return <RoomItem
            key={index}
            creatorNickName={room.creatorNickName}
            name={room.name}
            capacity={room.capacity}
            date={room.date}
        />
    });


    return (
        <ul className="roomList">
            {(Array.isArray(roomList) && roomList.length > 0) ? roomList : "No any room..."}
        </ul>
    );

}

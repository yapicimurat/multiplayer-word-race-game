

export default function RoomItem({creatorNickName, name, capacity, date}){


    return (
        <li className="roomItem">Player: {creatorNickName}, Name: {name}, Capacity: {capacity}, Date: {date} <span><button className="joinRoom">JOIN</button></span></li>
    );
}

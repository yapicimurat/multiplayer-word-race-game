import "./room.css";


export default function CreateRoom(){

    return (
        <>
            <p>Fill out all informations to create a room!</p>
            <form className="createRoom">
                <label htmlFor="roomName">Room Name</label>
                <input type="text" id="roomName" required/>
                <label htmlFor="roomCapacity">Room Capacity</label>
                <input type="number" min="2" max="10" id="roomCapacity" required/>
                <button type="submit">Create Room</button>
            </form>
        </>
    );
}

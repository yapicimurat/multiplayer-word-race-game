import {SOCKET} from "../../config";
import { useState } from "react";
import "./room.css";
import {useSelector} from "react-redux";

export default function CreateRoom(){

    const socket = useSelector(state => state.playerReducer.socket);

    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(2);


    const nameOnChange = (e) => {
        setName(e.target.value);
    };

    const capacityOnChange = (e) => {
        setCapacity(parseInt(e.target.value));
    };


    const submitFormEvent = (e) => {
        e.preventDefault();

        if(capacity < 2 || capacity > 10 || name === "" || !socket.connected) return;

        /*
            SERVER EXPECTS THIS STRUCT
            socketId: socket.id,
            roomName: roomName,
            roomCapacity: roomCapacity
        */
        socket.emit(SOCKET.EMIT_EVENTS.CREATE_ROOM,{
            socketId: socket.id,
            roomName: name,
            roomCapacity: capacity
        });
    };


    return (
        <>
            <p>Fill out all informations to create a room!</p>
            <form className="createRoom" onSubmit={submitFormEvent}>
                <label htmlFor="roomName">Room Name</label>
                <input type="text" id="roomName" onChange={nameOnChange} value={name} required/>
                <label htmlFor="roomCapacity">Room Capacity</label>
                <input type="number" min="2" max="10" id="roomCapacity" onChange={capacityOnChange} value={capacity}  required/>
                <button type="submit">Create Room</button>
            </form>
        </>
    );
}

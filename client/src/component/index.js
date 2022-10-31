import Header from "./header.js";
import Content from "./content.js";
import Footer from "./footer.js";
import StartScreen from "./startScreen.js";

import {SOCKET} from "../config";
import { io } from "socket.io-client";

import "./style.css";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setNickName, setSocket} from "../features/player/playerSlice.js";
import {setRoomList} from "../features/room/roomSlice.js";

export default function Index(){

    const dispatch = useDispatch();

    useEffect(() => {
        //connect socket server and save into global state
        const socket = io(SOCKET.URL);

        socket.on(SOCKET.ON_EVENTS.CONNECT, () => {
            //connected...
            //REQUEST FOR ROOM LIST

            socket.emit(SOCKET.EMIT_EVENTS.GET_ROOM_INFORMATIONS);

            dispatch(setSocket({socket}));
        });


        socket.on(SOCKET.ON_EVENTS.CLIENT_ROOM_INFORMATIONS, (roomList) => {
            //set roomList glb. state
            dispatch(setRoomList({roomList}));
        });

        socket.on(SOCKET.ON_EVENTS.CREATE_NICKNAME, (data) => {
            if(!data.result){
                dispatch(setNickName({nickName: data.nickName}));
                return;
            }

            alert("NickName is already exist.");

        });


    }, []);


    return (
        <>
            <Header/>
            <Content content={<StartScreen/>}/>
            <Footer/>
        </>
    );
}

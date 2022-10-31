import Header from "./header.js";
import Content from "./content.js";
import Footer from "./footer.js";
import StartScreen from "./startScreen.js";
import GameScreen from "./game/gameScreen.js";

import {SOCKET} from "../config";
import { io } from "socket.io-client";

import "./style.css";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setNickName, setSocket, setIsInGame} from "../features/player/playerSlice.js";
import {setRoomList} from "../features/room/roomSlice.js";

export default function Index(){

    const isInGame = useSelector(state => state.playerReducer.isInGame);

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
            //set roomList global state
            dispatch(setRoomList({roomList}));
        });

        socket.on(SOCKET.ON_EVENTS.CREATE_NICKNAME, (data) => {
            if(!data.result){
                dispatch(setNickName({nickName: data.nickName}));
                return;
            }

            alert("NickName is already exist.");

        });


        socket.on(SOCKET.ON_EVENTS.CREATE_ROOM, (result) => {
            /*
                callback parameter result presents following
                ---------------------------------------------------
                isSuccessfully: isSuccessfully,
                errorMessage: errorMessage
            */
            if(!result.isSuccessfully) { alert(result.errorMessage); return; }

            dispatch(setIsInGame(true));

        });

    }, []);

    const CONTENTS = {
        START_SCREEN: <StartScreen/>,
        GAME_SCREEN: <GameScreen/>
    };


    const getContent = () => {
        //TODO: Here may different contents in future
        //for now only startScreen and gameScreen
        if(!isInGame) return CONTENTS.START_SCREEN;
        else return CONTENTS.GAME_SCREEN;
    }

    return (
        <>
            <Header/>
            <Content content={getContent()}/>
            <Footer/>
        </>
    );
}

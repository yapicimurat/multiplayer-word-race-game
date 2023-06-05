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
import {setNickName, setSocket, setIsInGame, setRoom} from "../features/player/playerSlice.js";
import {setRoomList} from "../features/room/roomSlice.js";
import {setCreateRoomForm} from "../features/general/generalSlice";
import LoginScreen from "./loginScreen";
import fetcher, {REQUEST_TYPE} from "../util/fetcher";
import EndPoints from "../constant/endPoints";
import Register from "./register";

export default function Index(){

    const {isInGame, socket, room, loggedIn, player} = useSelector(state => state.playerReducer);
    const {registerPage} = useSelector(state => state.generalReducer);
    const dispatch = useDispatch();


    const connectSocket = () => {
        if(socket === null)
            return io(SOCKET.URL);
        else
            return socket;
    }

    useEffect(() => {

        const socket = connectSocket();

        socket.on(SOCKET.ON_EVENTS.CONNECT, () => {
            //connected...
            //REQUEST FOR ROOM LIST

            socket.emit(SOCKET.EMIT_EVENTS.GET_ROOM_INFORMATIONS);

            dispatch(setSocket({socket}));
        });

        socket.on(SOCKET.ON_EVENTS.CLIENT_ROOM_INFORMATIONS, (roomList) => {
            dispatch(setRoomList({roomList}));
            if(isInGame){

                const room = roomList.filter(room => {
                    return (room.users.filter(user => user.socketId === socket.id).length > 0)
                });
                if(room.length > 0) {
                    dispatch(setRoom(room[0]));
                }
            }
        });

        socket.on(SOCKET.ON_EVENTS.CLIENT_GAME_INFORMATIONS, (room) => {
            //incoming server room's game information per second..

            //update user joined or created room per second...
            if(isInGame){
                dispatch(setRoom(room));
            }

        });

        socket.on(SOCKET.ON_EVENTS.SPECIAL_ROOM_INFORMATION, (receivedRoom) => {
            //extra security...
            if(room !== null){
                if(receivedRoom.name === room?.name)
                    dispatch(setRoom(receivedRoom));
            }

        });

        socket.on(SOCKET.ON_EVENTS.CREATE_NICKNAME, (data) => {
            if(!data.result){
                dispatch(setNickName({nickName: data.nickName}));
                return;
            }

            alert("NickName is already exist.");

        });

        socket.on(SOCKET.ON_EVENTS.CREATE_ROOM, (data) => {
            /*
                callback parameter result presents following
                ---------------------------------------------------
                isSuccessfully: isSuccessfully,
                errorMessage: errorMessage
            */
            const {isSuccessfully, errorMessage, room} = data;
            if(!isSuccessfully) {
                alert(errorMessage); return;
            }

            dispatch(setIsInGame({isInGame: true, room }));

        });

        socket.on(SOCKET.ON_EVENTS.JOIN_ROOM, (data) => {
            const {isSuccessfully, errorMessage, room} = data;
            if(isSuccessfully){
                dispatch(setIsInGame({isInGame: true, room: room}));
            }else{
                alert(errorMessage);
            }
        });

        socket.on(SOCKET.ON_EVENTS.CLIENT_END_GAME, async (room) => {
            alert(`!!! Game is end !!! The Winner is : ${room.users.sort((a, b) => b.score - a.score)[0].nickName}`);

            //game is end
            dispatch(setIsInGame({isInGame: false, room: null }));
            dispatch(setCreateRoomForm(false));



        })

    }, [isInGame]);

    const CONTENTS = {
        START_SCREEN: <StartScreen/>,
        GAME_SCREEN: <GameScreen/>,
        LOGIN_SCREEN: <LoginScreen/>,
        REGISTER_SCREEN: <Register/>
    };


    const getContent = () => {
        const accessToken = localStorage.getItem("access_token");

        if(loggedIn && !isInGame) return CONTENTS.START_SCREEN;
        else if(loggedIn && isInGame) return CONTENTS.GAME_SCREEN;
        else if(!loggedIn && (accessToken === "" || accessToken === null || accessToken === undefined) && !registerPage) {
            return CONTENTS.LOGIN_SCREEN;
        }
        else if(!loggedIn && registerPage) {
            return CONTENTS.REGISTER_SCREEN;
        }
    }

    return (
        <>
            <Header/>
            <Content content={getContent()}/>
            <Footer/>
        </>
    );
}

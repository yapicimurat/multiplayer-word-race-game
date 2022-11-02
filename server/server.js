import express from "express";
import http from "http";
import {GAME_MODE, PORT, EMIT_EVENTS, ON_EVENTS} from "./constants.js";
import {Server} from "socket.io";
import fs from "fs";
//UTIL FUNCTION
import {arrayIsEmpty} from "./util.js";
import Word from "./word.js";
import Player from "./player.js";
import Room from "./room.js";
import Game from "./game.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server ,{
    cors: {
        origin: "*"
    }
});


const gameList = [];
const playerList = [];
const roomList = [];
const wordList = [];

const classicWords = [];
const languageWords = [];


//READ ALL WORDS IN "words.txt" FILE AND PUSH TO wordList arr...
try{
    const words = fs.readFileSync("./words.txt", "utf8")
        .split("#\n")[1]
        .split("\n");

    words.forEach(wordLine => {
        if(wordLine === "\n" || wordLine.length < 1) return;

        const wordSplitted = wordLine.split(">");

        //mode>key>value
        const mode = parseInt(wordSplitted[0]);
        const key = wordSplitted[1];
        const value = wordSplitted[2];

        switch(mode){
            case GAME_MODE.CLASSIC:
                classicWords.push(new Word(key, value, GAME_MODE.CLASSIC));
            break;

            case GAME_MODE.LANGUAGE:
                languageWords.push(classicWords.push(new Word(key, value, GAME_MODE.LANGUAGE)));
            break;

            default:
                console.error("Invalid mode. Check the words.txt file...");
            break;
        }
    });


}catch(err){
    console.error(err);
}

const asyncCheckNickNameIsExist = (nickname) => {
    return Promise.resolve(playerList.filter(player => player.nickName === nickname).length > 0);
};

const asyncGetRoomByName = (roomName) => {
  return Promise.resolve(roomList.filter(room => room.name === roomName));
};

const asyncGetPlayerByNickname = (nickName) => {
  return Promise.resolve(playerList.filter(player => player.nickName === nickName));
};

const asyncGetPlayerBySocketId = (socketId) => {
    return Promise.resolve(playerList.filter(player => player.socketId === socketId));
};

const fillGameWords = (game) => {
    switch(game.gameMode){
        case GAME_MODE.CLASSIC:
            game.wordList = classicWords;
            break;
        case GAME_MODE:
            game.wordList = languageWords;
            break;
    }
};

io.on("connection", (socket) => {
    console.log(`${socket.id} socket connected the server.`);

    socket.on(ON_EVENTS.GET_ROOM_INFORMATIONS, () => {
       socket.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);
    });

    socket.on(ON_EVENTS.CREATE_NICKNAME, async (nickname) =>  {
        asyncCheckNickNameIsExist(nickname)
        .then(result => {
            if(!result) playerList.push(new Player(socket.id, nickname));



            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, {result: result, nickName: nickname});
        })
        .catch(err => {
            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, {result: true, nickName: nickname});
        });

    });

    socket.on(ON_EVENTS.CREATE_ROOM, async (data) => {
        let isSuccessfully = false;
        let errorMessage = "";
        /*
            socketId: socket.id,
            roomName: roomName,
            roomCapacity: roomCapacity
        */

        const {socketId, roomName, roomCapacity} = data;

        const searchedRoom = await asyncGetRoomByName(roomName);

        const userCheck = await asyncCheckNickNameIsExist(playerList.filter(player => {
           return player.socketId === socketId
        })[0].nickName);

        if(!userCheck){
            errorMessage = "Firstly, enter your nickname.";
        }
        else if(userCheck && !arrayIsEmpty(searchedRoom, 0)){
            errorMessage = "Room already exist.";
        }
        else{
            let foundedUser = (await asyncGetPlayerBySocketId(socketId))[0];
            //firstly clean user
            foundedUser.clean();

            foundedUser.inGame = true;
            foundedUser.isOwner = true;

            isSuccessfully = true;
            socket.join(roomName);
            const room = new Room(roomName, roomCapacity);

            room.creatorPlayer = foundedUser;
            roomList.push(room);
            room.users.push(foundedUser);

            //ROOM IS CREATED AND CREATE A GAME
            const game = new Game(roomName);
            room.game = game;

            //fill game wordList
            fillGameWords(game);

            socket.emit(EMIT_EVENTS.CREATE_ROOM, {
                isSuccessfully: isSuccessfully,
                errorMessage: errorMessage,
                room: room
            });
        }


        if(isSuccessfully)
            socket.broadcast.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);

    });

    socket.on(ON_EVENTS.JOIN_ROOM, async (data) => {
        let isSuccessfully = true;
        let errorMessage = "";

        const {roomName, userSocketId} = data;

        const room = await asyncGetRoomByName(roomName);
        const user = await asyncGetPlayerBySocketId(userSocketId);
        if(!arrayIsEmpty(room, 0) && !arrayIsEmpty(user, 0)){
            if(room[0].users.length + 1 <= room[0].capacity){
                user[0].clean();
                user[0].inGame = true;
                socket.join(roomName);
                room[0].users.push(user[0]);
                socket.emit(EMIT_EVENTS.JOIN_ROOM, room[0]);
            }else{
                isSuccessfully = false;
                errorMessage = "Room is full.";
            }

        }else{
            isSuccessfully = false;
            errorMessage = "An error occurred.";
        }

        if(isSuccessfully)
            socket.broadcast.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);

        socket.emit(EMIT_EVENTS.JOIN_ROOM, {
            isSuccessfully: isSuccessfully,
            errorMessage: errorMessage,
            room: room[0]
        });
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} socket disconnected the server.`);


    });
});


server.listen(PORT, () => {
    console.log(`Server is listenin on port ${PORT}`);
});

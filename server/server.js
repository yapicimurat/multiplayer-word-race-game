import express from "express";
import http from "http";
import {GAME_MODE, PORT, EMIT_EVENTS, ON_EVENTS} from "./constants.js";
import {Server} from "socket.io";
import fs from "fs";
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

const asyncCheckRoomNameIsExist = (roomName) => {
  return Promise.resolve(roomList.filter(room => room.name === roomName));
};

const asyncGetPlayerByNickname = (nickName) => {
  return Promise.resolve(playerList.filter(player => player.nickName === nickName));
};

const asyncGetPlayerBySocketId = (socketId) => {
    return Promise.resolve(playerList.filter(player => player.socketId === socketId));
};



io.on("connection", (socket) => {
    console.log(`${socket.id} socket connected the server.`);

    //EMIT ROOMLIST WHEN INCOME REQUEST FOR ROOMLIST
    socket.on(ON_EVENTS.GET_ROOM_INFORMATIONS, () => {
       socket.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);
    });

    //REQUEST FOR CREATE NICKNAME
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

    //REQUEST FOR CREATE ROOM
    socket.on(ON_EVENTS.CREATE_ROOM, async (data) => {
        /*
            socketId: socket.id,
            roomName: roomName,
            roomCapacity: roomCapacity
        */
        let isSuccessfully = false;
        let errorMessage = "";
        const {socketId, roomName, roomCapacity} = data;

        const roomCheckResult = await asyncCheckRoomNameIsExist(roomName);
        const playerCheckResult = await asyncCheckNickNameIsExist(playerList.filter(player => {
           return player.socketId === socketId
        })[0].nickName);

        if(playerCheckResult === false) errorMessage = "Firstly, enter your nickname.";
        else if(playerCheckResult === true && (!roomCheckResult || roomCheckResult.length > 0)) errorMessage = "Room already exist.";
        else{
            isSuccessfully = true;
            socket.join(roomName);
            const room = new Room(roomName, roomCapacity);
            let foundedUser = await asyncGetPlayerBySocketId(socketId);
            foundedUser = (foundedUser.length > 0) ? foundedUser[0] : null;
            room.creatorPlayer = foundedUser;
            roomList.push(room);
            room.users.push(foundedUser);

            //ROOM IS CREATED AND CREATE A GAME
            const game = new Game(roomName);

            room.game = game;

            console.log(room);


        }
        socket.emit(EMIT_EVENTS.CREATE_ROOM, {
            isSuccessfully: isSuccessfully,
            errorMessage: errorMessage
        });

        socket.broadcast.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);

    });


    socket.on("disconnect", () => {
        console.log(`${socket.id} socket disconnected the server.`);


    });
});


server.listen(PORT, () => {
    console.log(`Server is listenin on port ${PORT}`);
});

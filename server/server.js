import express from "express";
import http from "http";
import {GAME_MODE, PORT, EMIT_EVENTS, ON_EVENTS} from "./constants.js";
import {Server} from "socket.io";
import fs from "fs";
import Word from "./word.js";
import Player from "./player.js";


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

io.on("connection", (socket) => {
    console.log(`${socket.id} socket connected the server.`);


    //EMIT ROOMLIST WHEN INCOME REQUEST FOR ROOMLIST
    socket.on(ON_EVENTS.GET_ROOM_INFORMATIONS, () => {
       socket.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);
    });


    socket.on(ON_EVENTS.CREATE_NICKNAME, async (nickname) =>  {
        asyncCheckNickNameIsExist(nickname)
        .then(result => {
            if(!result) playerList.push(new Player(socket.id, nickname));

            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, result);
        })
        .catch(err => {
            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, true);
        });

    });


    socket.on("disconnect", () => {
        console.log(`${socket.id} socket disconnected the server.`);


    });
});


server.listen(PORT, () => {
    console.log(`Server is listenin on port ${PORT}`);
});

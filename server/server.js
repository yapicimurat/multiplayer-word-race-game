import express from "express";
import http from "http";
import {GAME_MODE, PORT, EMIT_EVENTS, ON_EVENTS, EVENT_EMITTERS, GAME} from "./constants.js";
import {Server} from "socket.io";
import fs from "fs";
import {arrayIsEmpty} from "./util.js";
import Word from "./word.js";
import Player from "./player.js";
import Room from "./room.js";
import Game from "./game.js";
import events from "events";
import wordBuilder, {pushWordToGame} from "./wordBuilder.js";
import fetcher from "./util/fetcher.js";
import {REQUEST_TYPE} from "./util/fetcher.js";
import EndPoints from "./constants.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server ,{
    cors: {
        origin: "*"
    }
});

//create event emitter
const eventEmitter = new events.EventEmitter();

const playerList = [];
const playerDBList = {};
const roomList = [];

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
                languageWords.push(new Word(key, value, GAME_MODE.LANGUAGE));
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

io.on("connection", (socket) => {
    console.log(`${socket.id} socket connected the server.`);

    socket.on(ON_EVENTS.GET_ROOM_INFORMATIONS, () => {
       socket.emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);
    });

    socket.on(ON_EVENTS.CREATE_NICKNAME, async (data) =>  {
        asyncCheckNickNameIsExist(data.nickName)
        .then(result => {
            if(!result) playerList.push(new Player(socket.id, data.id, data.nickName));

            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, {result: result, nickName: data.nickName});
        })
        .catch(err => {
            socket.emit(EMIT_EVENTS.CREATE_NICKNAME, {result: true, nickName: data.nickName});
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
        })[0]?.nickName);

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

            //build word list
            //game is classic in default
            //fillGameWords(game);
            buildWords(room.game);

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

                //socket.emit(EMIT_EVENTS.JOIN_ROOM, room[0]);
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

    socket.on(ON_EVENTS.SERVER_PLAYER_READY, async (nickName) => {
        const player = await asyncGetPlayerBySocketId(socket.id);
        player[0].isReady = true;

    });

    socket.on(ON_EVENTS.SERVER_COMPLETE_WORD, async (data) => {
        //data includes => word and roomName
        const room = await asyncGetRoomByName(data.roomName);

        if(room[0].game.currentWordList.some(currentWord => currentWord.val === data.word)) {
            const player = room[0].users.filter(user => user.socketId === socket.id)[0];

            player.score = player.score + data.word.length * 2;

            const wordIndex = room[0].game.currentWordList.map(currentWord => currentWord.val).indexOf(data.word);

            room[0].game.currentWordList.splice(wordIndex, 1);
            await pushWordToGame(classicWords, languageWords, room[0].game, 1);

            io.to(data.roomName).emit(EMIT_EVENTS.CLIENT_GAME_INFORMATIONS, room[0]);
        }

    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} socket disconnected the server.`);

        eventEmitter.emit(EVENT_EMITTERS.FIND_USER_AND_DESTROY_DEPENDENCIES, socket.id);
    });

});

eventEmitter.on(EVENT_EMITTERS.FIND_USER_AND_DESTROY_DEPENDENCIES, async (socketId) => {
    /*
        DEPENDENCIES OF A USER
        - playerList
        - roomList
    * */

    const userArray = await asyncGetPlayerBySocketId(socketId);

    if(!arrayIsEmpty(userArray, 0)){
        const user = userArray[0];

        const indexInPlayerList = playerList.findIndex(player => player.socketId === socketId);
        playerList.splice(indexInPlayerList, 1);
        if(user.inGame === true){
            const room = roomList.filter(room => {
                return (room.users.filter(user => user.socketId === socketId).length > 0);
            })[0];

            if(room?.users.length > 1) {
                const indexInRoomUsers = room.users.findIndex(player => player.socketId === socketId);
                room.users.splice(indexInRoomUsers, 1);
                if(user.isOwner === true){
                    room.creatorPlayer = room.users[0];
                    room.users[0].isOwner = true;
                }

                if(room.users.length === 1) {
                    room.countdownToStartInSecond = 30;
                    room.game.isStarted = false;
                }

            }
            else{
                const roomIndexInRoomList = roomList.findIndex(room => room.name === room.name);
                roomList.splice(roomIndexInRoomList, 1);
            }

            io.of("/").emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);

        }
    }

});

const buildWords = (game) => {
    if(game.defaultWordList.length === 0) {
        wordBuilder(classicWords, languageWords, game, 5);
    }
};

//GENERAL TIMER FOR ALL ROOM'S
setInterval(async () => {

    roomList.forEach((room, index) => {
        if(room.game?.isStarted === false) {

            if(room.users.length > 1) {
                const notReadyPlayers = room.users
                    .filter(player => !player.isReady);

                if(notReadyPlayers.length > 0) {
                    if(room.countdownToStartInSecond - 1 > 0) {
                        room.countdownToStartInSecond = room.countdownToStartInSecond - 1;
                    }
                    else{
                        room.game.isStarted = true;
                        room.users = room.users.map(player => player.isReady = true);
                    }

                }else{
                    room.game.isStarted = true;

                }
                io.to(room.name).emit(EMIT_EVENTS.SPECIAL_ROOM_INFORMATION, room);
            }

        }else{
            //FOR STARTED GAMES
            if(room.game.totalTimeInSeconds - 1 >= 0) {
                room.game.totalTimeInSeconds -= 1;
                io.to(room.name).emit(EMIT_EVENTS.CLIENT_GAME_INFORMATIONS, room);
            }else{
                //room index
                const roomIndex = roomList.map(room => room.name).indexOf(room.name);
                roomList.splice(roomIndex, 1);
                io.of("/").emit(EMIT_EVENTS.CLIENT_ROOM_INFORMATIONS, roomList);

                //game end
                io.to(room.name).emit(EMIT_EVENTS.CLIENT_END_GAME, room);

                (async () => {
                    const gameTotalScore = room.users.map(user => user.score).reduce((total, current) => total + current);
                    const roomRequestBody = {
                        creatorId: room.creatorPlayer.DBId,
                        winnerId: room.users.sort((a, b) => b.score - a.score)[0]?.DBId,
                        roomName: room.name,
                        capacity: room.capacity
                    };

                    const {data, error} = await fetcher(EndPoints.CREATE_ROOM, REQUEST_TYPE.POST, roomRequestBody);
                    const roomId = data.id;
                    if(!error) {

                        const gameRequestBody = {
                            roomId: roomId,
                            totalScore: gameTotalScore
                        };

                        const {data, error} = await fetcher(EndPoints.CREATE_GAME, REQUEST_TYPE.POST, gameRequestBody);
                        const gameId = data.id;
                        if(!error) {


                            room.users.forEach(user => {
                                (async () => {
                                    const userScoreRequestBody = {
                                        userId: user.DBId,
                                        gameId: gameId,
                                        score: user.score
                                    };

                                    const {data, error} = await fetcher(EndPoints.CREATE_USER_SCORE, REQUEST_TYPE.POST, userScoreRequestBody);
                                    user.clean();
                                })();
                            });


                        }
                    }


                })();


                roomList.splice(index, 1);
            }
        }


    });


}, 1000);




server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



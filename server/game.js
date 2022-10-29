import {GAME_MODE} from "./constants.js";

export default class Game{

    constructor(key){
        this.key = key;

        this.room = null;
        this.wordList = [];
        this.isStarted = false;
        this.gameMode = GAME_MODE.CLASSIC;
        this.startTimeAsDate = null;
        this.totalTimeInMinutes = 180;
        this.elapsedTimeInMinutes = 0;

    }

    start(){
        this.isStarted = true;
        this.startTimeAsDate = Date.now();

    }



}

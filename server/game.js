import {GAME, GAME_MODE} from "./constants.js";

export default class Game{

    constructor(key){
        this.key = key;
        this.defaultWordList = [];
        this.currentWordList = [];
        this.isStarted = false;
        this.gameMode = GAME_MODE.CLASSIC;
        //this.startTimeAsDate = null;
        this.totalTimeInSeconds = GAME.GAME_TIME_IN_SECOND;
        //this.elapsedTimeInSecond = 0;
    }

    start() {
        this.isStarted = true;
        this.startTimeAsDate = Date.now();

    }



}

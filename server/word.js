import {GAME_MODE} from "./constants.js";
export default class Word{

    constructor(key, value, mode){
        this.key = key;
        this.value = value;

        //DEFAULT
        this.mode = mode;

        this.x = -1;
        this.y = -1;
        this.color = "#fff";
        this.fontSize = "16px";
        this.fontFamily = "Arial";
        this.visibility = true;
        this.rotationDegree = 0;
        this.estimatedWidth = 0;
        this.height = "40px";

    }

    set value(val){
        this.val = val.trim();
        this.estimatedWidth = this.val.length * this.fontSize * 0.6;
    }




}

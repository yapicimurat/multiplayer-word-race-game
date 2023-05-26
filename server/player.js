export default class Player{

    constructor(socketId, dbId, nickName){

        this.socketId = socketId;
        this.DBId = dbId;
        this.nickName = nickName;
        this.score = 0;
        this.rank = -1;
        //it's cause circular in Room class, for now deprecated
        //this.room = null;

        this.isOwner = false;
        this.inGame = false;
        this.isReady = false;

    }

    clean(){
        this.score = 0;
        this.rank = -1;
        this.isOwner = false;
        this.inGame = false;
        this.isReady = false;
    }

}

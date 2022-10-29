export default class Player{

    constructor(socketId, nickName){

        this.socketId = socketId;
        this.nickName = nickName;
        this.score = 0;
        this.rank = -1;
        this.room = null;
        this.isOwner = false;

    }

    clearInformation(){
        this.score = 0;
        this.rank = -1;
        this.room = null;
        this.isOwner = false;
    }

}

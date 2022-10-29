export default class Room{

    constructor(socketId, name, capacity){
        this.socketId = socketId;
        this.name = name;

        this.capacity = capacity;
        this.creatorPlayer = null;
        this.game = null;
        this.createdAt = Date.now();

    }



}

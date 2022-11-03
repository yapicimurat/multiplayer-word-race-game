export default class Room{

    constructor( name, capacity ){
        this.name = name;

        this.capacity = capacity;
        this.creatorPlayer = null;
        this.game = null;
        this.users = [];
        this.createdAt = Date.now();

        this.countdownToStartInSecond = 30


    }



}

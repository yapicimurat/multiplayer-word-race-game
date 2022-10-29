import {io} from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";

const socket = io("127.0.0.1:3000");
const connectedEvent = new Event("connected");


socket.on("connect", () => {
    window.dispatchEvent(connectedEvent);

});

export default socket;


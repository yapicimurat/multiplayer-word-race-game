import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nickName: "",
    socket: null,
    isInGame: false,
    room: null
    /*
    TODO:
    isInGame is true when;
        - Player create a room
        - Player join a room
    */
};

export const playerSlice = createSlice({
    name: "playerSlice",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload.socket;
            console.log(action.payload.socket);
        },
        setNickName: (state, action) => {
            state.nickName = action.payload.nickName;
        },
        setIsInGame: (state, action) => {
            //action.payload has, "isInGame", "room"
            state.isInGame = action.payload.isInGame;
            state.room = action.payload.room;

            console.log(action.payload);
        },

    },
});

export const {setSocket, setNickName, setIsInGame} = playerSlice.actions;
export default playerSlice.reducer;

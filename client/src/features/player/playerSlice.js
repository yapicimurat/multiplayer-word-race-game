import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nickName: "",
    socket: null,
    isInGame: false,
    room: null,
    loggedIn: false,
    player: null,
};

export const playerSlice = createSlice({
    name: "playerSlice",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload.socket;
        },
        setNickName: (state, action) => {
            state.nickName = action.payload.nickName;
        },
        setIsInGame: (state, action) => {
            //action.payload has, "isInGame", "room"
            state.isInGame = action.payload.isInGame;
            state.room = action.payload.room;

        },
        setRoom: (state, action) => {
            state.room = action.payload;
        },
        setLoggedIn: (state, action) => {
            //action.payload => true or false
            state.loggedIn = action.payload;
        },
        setPlayer: (state, action) => {
            state.player = action.payload;
        }
    },
});

export const {setSocket, setNickName, setIsInGame, setRoom, setLoggedIn, setPlayer} = playerSlice.actions;
export default playerSlice.reducer;

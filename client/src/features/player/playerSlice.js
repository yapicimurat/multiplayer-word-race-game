import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nickName: "",
    socket: null,

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
        }
    },
});

export const {setSocket, setNickName} = playerSlice.actions;
export default playerSlice.reducer;

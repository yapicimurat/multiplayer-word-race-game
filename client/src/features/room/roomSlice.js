import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomList: [],
};

export const roomSlice = createSlice({
    name: "roomSlice",
    initialState,
    reducers: {
        setRoomList: (state, action) => {
            state.roomList = action.payload.roomList;
        },
    },
});

export const {setRoomList} = roomSlice.actions;
export default roomSlice.reducer;

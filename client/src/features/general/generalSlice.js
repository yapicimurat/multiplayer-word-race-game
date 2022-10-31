import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreateRoomFormOpen: false,


};

export const generalSlice = createSlice({
    name: "generalSlice",
    initialState,
    reducers: {
        setCreateRoomForm: (state, action) => {
            state.isCreateRoomFormOpen = action.payload;
        }
    },
});


export const {setCreateRoomForm} = generalSlice.actions;
export default generalSlice.reducer;

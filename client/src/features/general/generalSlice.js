import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreateRoomFormOpen: false,
    registerPage: false,

};

export const generalSlice = createSlice({
    name: "generalSlice",
    initialState,
    reducers: {
        setCreateRoomForm: (state, action) => {
            state.isCreateRoomFormOpen = action.payload;
        },
        setRegister: (state, action) => {
            state.registerPage = action.payload;
        }
    },
});


export const {setCreateRoomForm, setRegister} = generalSlice.actions;
export default generalSlice.reducer;

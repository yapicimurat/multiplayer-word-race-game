import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "../features/player/playerSlice.js";
import roomReducer from "../features/room/roomSlice.js";


export const store = configureStore({
   middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
         serializableCheck: false
      })
   },
   reducer: {
      playerReducer,
      roomReducer
   }
});

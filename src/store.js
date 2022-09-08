import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./features/dataSlice";

const store = configureStore({
  reducer: {
    cabinet: dataSlice,
  },
});

export default store;

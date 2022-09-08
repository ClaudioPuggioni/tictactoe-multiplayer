import { createSlice, current, nanoid } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: { userId: null, rooms: false, players: false, room: false, playerSign: false },
  reducers: {
    userInit: (state, action) => {
      state.userId = nanoid();
      console.log(current(state));
    },
    popRooms: (state, action) => {
      state.rooms = action.payload;
      console.log("POPROOMS:", current(state));
    },
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    selectedPlayers: (state, action) => {
      if (current(state).room === action.payload.room) {
        state.players = action.payload.players;
        for (const player of Object.keys(action.payload.players)) {
          if (action.payload.players[player] === current(state).userId) {
            state.rooms[action.payload.room].currPlayer = player;
            state.playerSign = player;
          }
        }
      }
      console.log("SELECTEDPLAYERS:", current(state));
    },
  },
});

export const { userInit, setRoom, popRooms, selectedPlayers } = dataSlice.actions;

export default dataSlice.reducer;

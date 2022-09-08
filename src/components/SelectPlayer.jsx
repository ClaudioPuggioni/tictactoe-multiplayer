import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function SelectPlayer({ togglePlayerX, togglePlayerO, delRoom, ele }) {
  const [xToggled, setXToggled] = useState(false);
  const [yToggled, setYToggled] = useState(false);
  const { userId } = useSelector((state) => state.cabinet);
  const { roomNo, roomAdmin, players } = ele;

  return (
    <div className="selectPlayerContainer" style={{ position: "relative" }}>
      {console.log("ELE IS:", ele)}
      <div className="selectPlayerHeader">Select Player:</div>
      <div className="selectPlayerBody">
        <div className="selectBg" id="selectBgX" style={{ backgroundColor: players.X ? "rgba(0, 110, 255, 0.2)" : "" }}>
          <button
            className="selectBtnPlayer"
            id="selectX"
            style={{ color: players.X ? "rgba(0, 110, 255, 0.78)" : "" }}
            onClick={() => {
              togglePlayerX(roomNo);
              setXToggled(true);
            }}
            disabled={xToggled || yToggled || players.X}
          >
            Player X
          </button>
        </div>
        <div className="selectBg" id="selectBgY" style={{ backgroundColor: players.O ? "rgba(255, 0, 81, 0.2)" : "" }}>
          <button
            className="selectBtnPlayer"
            id="selectO"
            style={{ color: players.O ? "rgba(255, 0, 81, 0.88)" : "" }}
            onClick={() => {
              togglePlayerO(roomNo);
              setYToggled(true);
            }}
            disabled={xToggled || yToggled || players.O}
          >
            Player O
          </button>
        </div>
      </div>
      <button
        style={{ display: roomAdmin === userId ? "flex" : "none" }}
        onClick={() => {
          if (roomAdmin === userId) delRoom(roomNo);
        }}
        className="delRoomBtn"
      >
        x
      </button>
    </div>
  );
}

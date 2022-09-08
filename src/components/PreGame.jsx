import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInit } from "../features/dataSlice";
import Rooms from "./Rooms";

export default function PreGame({ isMultiplayer, startGame, toggleMulti, getRooms, addRoom, delRoom, togglePlayerX, togglePlayerO }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userInit());
  }, []);

  return (
    <div id="preGameContainer">
      {!isMultiplayer ? (
        <>
          <div className="preGameHeader">Select Game Mode:</div>
          <div className="preGameSelect">
            <div id="soloBtnBG">
              <button className="selectBtn" id="soloBtn" onClick={() => startGame()}>
                SINGLE-PC DUEL
              </button>
            </div>
            <div className="selectBg" id="multiBtnBG">
              <button className="selectBtn" id="multiBtn" onClick={() => toggleMulti()}>
                ONLINE Multiplayer
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Rooms getRooms={getRooms} addRoom={addRoom} delRoom={delRoom} togglePlayerX={togglePlayerX} togglePlayerO={togglePlayerO} />
        </>
      )}
    </div>
  );
}

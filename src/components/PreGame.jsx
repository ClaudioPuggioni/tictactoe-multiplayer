import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInit } from "../features/dataSlice";
import Rooms from "./Rooms";

export default function PreGame({ isMultiplayer, startUp, toggleMulti, getRooms, addRoom, delRoom, togglePlayerX, togglePlayerO }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userInit());
    // eslint-disable-next-line
  }, []);

  return (
    <div id="preGameContainer">
      {!isMultiplayer ? (
        <>
          <div className="preGameHeader">Select Game Mode:</div>
          <div className="preGameSelect">
            <div id="soloBtnBG">
              <button className="selectBtn" id="soloBtn" onClick={() => startUp({ playerX: null, playerY: null })}>
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

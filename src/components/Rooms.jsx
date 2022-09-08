import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import SelectPlayer from "./SelectPlayer";

export default function Rooms({ getRooms, addRoom, delRoom, togglePlayerX, togglePlayerO }) {
  const { rooms } = useSelector((state) => state.cabinet);

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div id="roomsContainer">
      <div id="roomsHeader">
        <div id="roomsHeaderTxt">Available Rooms:</div>
        <button id="addRoomBtn" onClick={() => addRoom()}>
          <img id="addRoomBtnIcon" src="assets/plus-filled.svg" alt="plus svg" /> Add Room
        </button>
      </div>
      <div className="roomsDivider"></div>
      <div id="roomsList">
        {rooms
          ? Object.values(rooms).map((ele, idx) => {
              return (
                <div key={`RoomRow${idx}`} className="roomsRow">
                  {console.log(ele)}
                  Room No: {idx + 1}
                  <SelectPlayer key={`SelectPlayer${idx}`} togglePlayerX={togglePlayerX} togglePlayerO={togglePlayerO} delRoom={delRoom} ele={ele} />
                  <div key={`RoomRowDivider${idx}`} className="roomsDivider" style={{ width: "99%" }}></div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

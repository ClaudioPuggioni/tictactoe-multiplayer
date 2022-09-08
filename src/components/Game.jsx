import Board from "./Board";
import { useEffect, useState } from "react";
import { Howl } from "howler";
import WebSocket from "isomorphic-ws";
// import WebSocket from "react-use-websocket";
import { io } from "socket.io-client";
import PreGame from "./PreGame";
import { popRooms, selectedPlayers, setRoom } from "../features/dataSlice";
import { useDispatch, useSelector } from "react-redux";

const socket = io.connect("http://127.0.0.1:8371");

const Osound = new Howl({ src: "assets/Osound.mp3", volume: 0.57 });
const Xsound = new Howl({ src: "assets/Xsound.mp3", volume: 0.57 });

let startingBoard = new Array(3).fill(0).map((el) => new Array(3).fill(" "));
let boardHistory = [];
let ran = false;

function Game() {
  const dispatch = useDispatch();

  let [addDisappear, setAddDisappear] = useState(null);
  let [addAppear, setAddAppear] = useState(null);

  let [currBoard, setCurrentBoard] = useState(startingBoard);
  let [isXPlaying, setIsXPlaying] = useState(true);
  let [gameStatus, setGameStatus] = useState("Starting...");
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const { userId, room, playerSign } = useSelector((state) => state.cabinet);

  let [history, setHistory] = useState(boardHistory);

  useEffect(() => {
    if (room && !ran) {
      multiplayerPrep();
      ran = true;
    }
  }, [room]);

  function ticTacToeGameStatus(board, player) {
    function hasPlayerWon(player) {
      if (board[0][0] === player && board[0][1] === player && board[0][2] === player) {
        return true;
      } else if (board[1][0] === player && board[1][1] === player && board[1][2] === player) {
        return true;
      } else if (board[2][0] === player && board[2][1] === player && board[2][2] === player) {
        return true;
      } else if (board[0][0] === player && board[1][0] === player && board[2][0] === player) {
        return true;
      } else if (board[0][1] === player && board[1][1] === player && board[2][1] === player) {
        return true;
      } else if (board[0][2] === player && board[1][2] === player && board[2][2] === player) {
        return true;
      } else if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
      } else if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
      }
      return false;
    }

    if (hasPlayerWon(player)) {
      return player === "X" ? "Player X has won" : "Player O has won";
    } else if (board[0].includes(" ") || board[1].includes(" ") || board[2].includes(" ")) {
      return "Game in Progress";
    } else {
      return "Draw";
    }
  }

  let handleClick = (row, col) => {
    if (!isMultiplayer) {
      if (gameStatus.slice(gameStatus.length - 3) !== "won" && gameStatus !== "Draw" && currBoard[row][col] === " ") {
        let copyBoard = JSON.parse(JSON.stringify(currBoard));

        copyBoard[row][col] = isXPlaying ? "X" : "O";
        isXPlaying ? Xsound.play() : Osound.play();

        let temp = history.slice();
        temp.push({ board: copyBoard, currentPlayer: isXPlaying });
        setHistory(temp);

        setCurrentBoard(copyBoard);
        setIsXPlaying(!isXPlaying);

        setGameStatus(ticTacToeGameStatus(copyBoard, isXPlaying ? "X" : "O"));

        if (gameStatus.slice(gameStatus.length - 3) === "won" || gameStatus === "Draw") setIsXPlaying("gameover");
      }
    } else {
      let sign = isXPlaying ? "X" : "O";
      // console.log(sign, playerSign);
      if (gameStatus.slice(gameStatus.length - 3) !== "won" && gameStatus !== "Draw" && currBoard[row][col] === " " && playerSign === sign) {
        socket.emit("writeSign", { row: row, col: col, roomNo: room, player: playerSign });
      }
    }
  };

  socket.on("gameContinue", ({ roomNo, currentPlayer, board, gameStatus }) => {
    // console.log("RETURNED-ON-MOVE:");
    // console.log("roomNo:", roomNo);
    // console.log("currentPlayer:", currentPlayer);
    // console.log("gameStatus:", gameStatus);
    // console.log("board:", board);

    currentPlayer === "O" ? Xsound.play() : Osound.play();
    if (room === roomNo) {
      setIsXPlaying(currentPlayer === "X" ? true : false);
      setCurrentBoard(board);
      setGameStatus(gameStatus);

      if (gameStatus.slice(gameStatus.length - 3) === "won" || gameStatus === "Draw") {
        setIsXPlaying("gameover");
        setTimeout(() => {
          setAddDisappear(null);
          setAddAppear(null);
        }, 3000);
      }
    }
  });

  let somefunction = (index) => {
    setCurrentBoard(history[index].board);
    setIsXPlaying(!history[index].currentPlayer);
    history = history.slice(0, index + 1);
    setHistory(history);
    if (gameStatus.slice(gameStatus.length - 3) === "won" || gameStatus === "Draw") setGameStatus("Game in Progress");
  };

  function startUp({ playerX, playerO }) {
    // console.log("ISMULTIPLAYER:", isMultiplayer);
    if (!isMultiplayer) {
      setAddDisappear("disappearANI");
      setTimeout(() => {
        setAddAppear("appearANI");
      }, 2000);
    } else {
      // console.log("STARTUP PLAYERS CHECK:", playerX, playerO);
      if (playerX && playerO) {
        // console.log("FRONT/ROOM:", room);
        socket.emit("whoStart", room);
        socket.on("starter", ({ roomNo, currentPlayer }) => {
          // console.log("RECEIVED STARTER:");
          // console.log("roomNo:", roomNo);
          // console.log("currentPlayer:", currentPlayer);
          if (room === roomNo) currentPlayer === "X" ? setIsXPlaying(true) : setIsXPlaying(false);
        });
        setAddDisappear("disappearANI");
        setTimeout(() => {
          setAddAppear("appearANI");
        }, 2000);
      }
    }
  }

  function toggleMulti() {
    setIsMultiplayer(true);
  }

  function togglePlayerX(room) {
    // console.log("togglePlayerX Initiated!", room);
    dispatch(setRoom(room));
    socket.emit("connectPlayerX", { userId, room });
  }
  function togglePlayerO(room) {
    // console.log("togglePlayerO Initiated!", room);
    dispatch(setRoom(room));
    socket.emit("connectPlayerO", { userId, room });
  }

  function getRooms() {
    socket.emit("getRooms");
    socket.on("gotRooms", (roomsData) => {
      dispatch(popRooms(roomsData));
    });
  }

  function addRoom() {
    socket.emit("addRoom", userId);
    getRooms();
  }

  function delRoom(roomNo) {
    socket.emit("delRoom", roomNo);
  }

  function multiplayerPrep() {
    // console.log("multiplayerPrep activated");
    socket.on("connectedPlayers", (data) => {
      // console.log("connectedPlayers received", data);
      // console.log("ROOMCOMPARE:", data.room, room);
      dispatch(selectedPlayers(data));
      if (data.players.X && data.players.O && data.room === room) {
        // console.log("START INITIATED!!!");
        startUp({ playerX: data.players.X, playerO: data.players.O });
      }
    });
  }

  return (
    <div id="body">
      <div id="pregame" className={addDisappear}>
        <PreGame
          isMultiplayer={isMultiplayer}
          toggleMulti={toggleMulti}
          startGame={startUp}
          togglePlayerX={togglePlayerX}
          togglePlayerO={togglePlayerO}
          getRooms={getRooms}
          addRoom={addRoom}
          delRoom={delRoom}
        />
      </div>
      <div id="container" className={addAppear}>
        <div id="gameName">
          <h1>Disrespectful</h1> <h1>TicTacToe</h1>{" "}
          {isMultiplayer ? <h4>Player's Sign: {<span style={{ fontSize: "27px" }}>{playerSign}</span>}</h4> : null}
        </div>
        <div id="gameContainer">
          <div id="gameColumn">
            <div id="currentPlayerHeader">
              {!isMultiplayer ? (
                <div>
                  Current Player:<div id="currentPlayerXO">{isXPlaying ? "X" : "O"}</div>
                </div>
              ) : (
                <div style={{ opacity: isXPlaying === "gameover" ? "0%" : "100%" }}>
                  Current Player:
                  <div id="currentPlayerXO">
                    {isXPlaying && playerSign === "X" ? "Your turn" : !isXPlaying && playerSign === "O" ? "Your turn" : "Opponent's turn"}
                  </div>
                </div>
              )}
            </div>
            <Board currentBoardPassed={currBoard} handleClick={handleClick} />
            <div id="progress">Status: {gameStatus}</div>
          </div>
        </div>
        {!isMultiplayer ? (
          <div id="historyColumn">
            <div id="historyHeader">History</div>
            {history.map((ele, idx) => {
              return (
                <button key={`HistoryButton${idx}`} className="historyButtons" onClick={() => somefunction(idx)}>
                  Move #{idx + 1}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Game;

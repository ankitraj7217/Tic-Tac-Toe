import { ws } from "./websocket.js";

let arr = ["", "", "", "", "", "", "", "", ""];
let turn = true;

export function startGame() {
  const board = document.getElementsByClassName("container-grid")[0];
  board.addEventListener("click", sendBoxId);
}

function sendBoxId(event) {
  if (!event.target.hasChildNodes()) {
    const boxId = event.target.id[event.target.id.length - 1];
    const msg = {
      type: "game",
      boxId,
      turn,
      event,
    };
    ws.send(JSON.stringify(msg));
  }
}

export function onClickOnBoard(boxId, curr_turn) {
  const targetEle = document.getElementById(`grid-cell-${boxId}`);
  const elem = document.createElement("span");
  if (curr_turn) {
    elem.innerText = "X";
    elem.style.color = "blue";
  } else {
    elem.innerText = "O";
    elem.style.color = "red";
  }
  arr[boxId] = elem.innerText;
  targetEle.appendChild(elem);
  turn = !curr_turn;

  // this is done so that it runs after child element is appended
  setTimeout(() => {
    const winningPlayer = hasWon();
    if (winningPlayer === 0) {
      alert("Cats game!");
    } else if (winningPlayer === 1) {
      alert("X has won");
    } else if (winningPlayer === 2) {
      alert("O has won");
    }
    if (winningPlayer !== -1) {
      resetBoard();
    }
  }, 0);
}

// reset the board. page is not reloaded
function resetBoard() {
  const cells = document.getElementsByClassName("container-grid__cell");
  for (const cell of cells) {
    cell.hasChildNodes() && cell.removeChild(cell.childNodes[0]);
  }
  arr = ["", "", "", "", "", "", "", "", ""];
  turn = true;
}

function hasWon() {
  const winningPositions = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  for (let i = 0; i < winningPositions.length; i++) {
    const tempArr = winningPositions[i]; // just an alias for ease
    if (
      arr[tempArr[0]] === "X" &&
      arr[tempArr[1]] === "X" &&
      arr[tempArr[2]] === "X"
    )
      return 1;
    else if (
      arr[tempArr[0]] === "O" &&
      arr[tempArr[1]] === "O" &&
      arr[tempArr[2]] === "O"
    )
      return 2;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "") {
      return -1;
    }
  }
  return 0;
}

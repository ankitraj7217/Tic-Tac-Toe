const board = document.getElementsByClassName("container-grid")[0];

board.addEventListener("click", onClickOnBoard);

let arr = ["", "", "", "", "", "", "", "", ""];
let turn = true;

function onClickOnBoard(event) {
  if (!event.target.hasChildNodes()) {
    const elem = document.createElement("span");
    if (turn) {
      elem.innerText = "X";
      elem.style.color = "blue";
    } else {
      elem.innerText = "O";
      elem.style.color = "red";
    }
    arr[event.target.id[event.target.id.length - 1]] = elem.innerText;
    event.target.appendChild(elem);
    turn = !turn;

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

// Chat Window Code
const clientID = Date.now();
const ws = new WebSocket(`ws://localhost:8000/ws/${clientID}`);
const inputEle = document.getElementsByClassName(`chat-room__cell`)[0];
inputEle.addEventListener(`keypress`, sendMessage);

function attachChatElement(client_name, message) {
  const ele = `<div class="chat-room__chats-name">${client_name}</div>
                <div class="chat-room__chats-message">${message}</div>`;
  const container = document.getElementsByClassName(`chat-room__chats`)[0];
  container.innerHTML += ele;
}

function sendMessage(event) {
  if (event.keyCode === 13) {
    const inputMessage = inputEle.value;
    inputEle.value = ``;
    ws.send(inputMessage);
  }
}

ws.onmessage = processMessage;

function processMessage(response) {
  [client_name, message] = response.data.split(`:`);
  attachChatElement(client_name, message);
}


import { attachChatElement } from "./chat.js";
import { onClickOnBoard } from "./game.js";

export var ws;

export async function createWebSocket() {
  const clientID = window.user_name;
  const complete_ws_ID = location.hash.slice(2) + "-" + clientID;
  ws = new WebSocket(`ws://localhost:8000/ws/${complete_ws_ID}`);
  ws.onmessage = processMessage;
  ws.onerror = handleError;
}

function handleError(event){
  const mainContentElement = document.getElementById(`main-content`);
  mainContentElement.style.display = `none`;
  const errorContainer = document.getElementById(`error-content`);
  errorContainer.style.display = `block`;
  const errorElement = document.getElementById(`error-content-msg`);
  const errorElementBtn = document.getElementById(`error-content-button`)
  errorElement.innerText = `Timed Out/Dont try to hack`;
  errorElementBtn.addEventListener(`click`, () => {
    location.replace("/index.html")
  })
}

function processMessage(response) {
  const data = JSON.parse(response.data);
  if (data.type === "chat") {
    const { client_name, message } = data;
    attachChatElement(client_name, message);
  } else if (data.type === "game") {
    const { boxId, turn } = data;
    onClickOnBoard(boxId, turn);
  } else if (data.type === "error") {
    const { message } = data;
    handleError();
  }
}

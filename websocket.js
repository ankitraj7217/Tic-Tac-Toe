import { attachChatElement } from "./chat.js";
import { onClickOnBoard } from "./game.js";

export var ws;

export async function createWebSocket(){
  const clientID = window.user_name;
  const complete_ws_ID = location.hash.slice(2) + "-" + clientID
  ws = new WebSocket(`ws://localhost:8000/ws/${complete_ws_ID}`);
  ws.onmessage = processMessage;
}



function processMessage(response) {
  const data = JSON.parse(response.data);
  if (data.type === "chat") {
    const { client_name, message } = data;
    attachChatElement(client_name, message);
  } else if (data.type === "game") {
    const { boxId, turn } = data;
    onClickOnBoard(boxId, turn);
  }
}

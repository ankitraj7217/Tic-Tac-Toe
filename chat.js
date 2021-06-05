import { ws } from "./websocket.js";

export function startChat() {
  const inputEle = document.getElementsByClassName(`chat-room__cell`)[0];
  function sendMessage(event) {
    if (event.keyCode === 13) {
      const inputMessage = inputEle.innerText;
      inputEle.innerText = ``;
      const msg = {
        type: "chat",
        message: inputMessage,
      };
      ws.send(JSON.stringify(msg));
    }
  }
  inputEle.addEventListener(`keypress`, sendMessage);
}

export function attachChatElement(client_name, message) {
  const ele = `<div class="chat-room__chats-name">${client_name}</div>
                <div class="chat-room__chats-message">${message}</div>`;
  const container = document.getElementsByClassName(`chat-room__chats`)[0];
  container.innerHTML += ele;
}

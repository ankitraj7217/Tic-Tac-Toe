import { createWebSocket } from "./websocket.js";
import { startChat } from "./chat.js";
import { startGame } from "./game.js";
import {placeHands} from "./clock.js";

const logged_in_html = `<div class="game-container">
                          <div class="container-grid">
                            <div class="container-grid__cell" id="grid-cell-0"></div>
                            <div class="container-grid__cell" id="grid-cell-1"></div>
                            <div class="container-grid__cell" id="grid-cell-2"></div>
                            <div class="container-grid__cell" id="grid-cell-3"></div>
                            <div class="container-grid__cell" id="grid-cell-4"></div>
                            <div class="container-grid__cell" id="grid-cell-5"></div>
                            <div class="container-grid__cell" id="grid-cell-6"></div>
                            <div class="container-grid__cell" id="grid-cell-7"></div>
                            <div class="container-grid__cell" id="grid-cell-8"></div>
                          </div>
                          </div>
                          <div class="chat-room">
                          <div class="chat-room__chats">
                            <div class="chat-room__chats-name"></div>
                            <div class="chat-room__chats-message"></div>
                          </div>
                          <div
                            contenteditable="true"
                            class="chat-room__cell"
                            placeholder="Enter your message">
                          </div>
                        </div>`;

async function generateNewId() {
  const response = await fetch("http://localhost:8000/getNewRoom");
  const unique_id = await response.json();
  return unique_id;
}

async function startNewRoom() {
  placeHands()
  if (location.hash.slice(2).length === 0) {
    const room_id = await generateNewId();
    history.pushState(null, "", `/#/${room_id}`);
  }

  const body = document.getElementsByTagName("body")[0];
  body.innerHTML += logged_in_html;
  await createWebSocket();
  startChat();
  startGame();
}

startNewRoom();

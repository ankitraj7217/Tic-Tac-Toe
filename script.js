import { createWebSocket } from "./websocket.js";
import { startChat } from "./chat.js";
import { startGame } from "./game.js";
import { placeClockHands } from "./clock.js";

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
  const main_content = document.getElementById("main-content");
  main_content.style.display = `block`;
  placeClockHands();
  if (location.hash.slice(2).length === 0) {
    const room_id = await generateNewId();
    history.pushState(null, "", `/#/${room_id}`);
  }

  main_content.innerHTML += logged_in_html;
  await createWebSocket();
  startChat();
  startGame();
}

const userNameEle = document.getElementById(`user-name-input`);
userNameEle.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && userNameEle.value !== ``) {
    window.user_name = userNameEle.value;
    const userNameDiv = document.getElementById(`user-name`)
    userNameDiv.style.display = `none`;
    startNewRoom();
  }
});

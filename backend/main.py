from fastapi import FastAPI, WebSocket
from typing import List

import json

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    async def broadcast(self, data: str):
        for connection in self.connections:
            await connection.send_text(data)

    def closeConnection(self, websocket: WebSocket):
        self.connections.remove(websocket)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"version": "0.1", "name": "Tic-Tac-Toe-backend"}

@app.websocket("/ws/{client_id}")
async def chat_room(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    while True:
        try:
            data = await websocket.receive_text()
            data = json.loads(data)
            data["client_name"] = client_id
            await manager.broadcast(json.dumps(data))
        except Exception as e:
            manager.closeConnection(websocket)
            print("Error :", e)
            break

    print("Bye")

chat_manager = ConnectionManager()

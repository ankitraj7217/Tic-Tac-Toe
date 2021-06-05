from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import json
import time

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.connections = []
        self.ids: List[int] = []

    async def connect(self, websocket: WebSocket, unique_id: str, user_name: str):
        await websocket.accept()
        print(self.connections)
        for x in self.connections:
            if x["id"] == unique_id:
                x["websockets"].append(websocket)
                x["user_names"].append(user_name)

    async def broadcast(self, unique_id:str, data: str):
        for obj in self.connections:
            if obj["id"] == unique_id:
                related_connections = obj["websockets"]
                for connection in related_connections:
                    await connection.send_text(data)

    def closeConnection(self, unique_id:str, websocket: WebSocket):
        for obj in self.connections:
            if obj["id"] == unique_id:
                related_connections = obj["websockets"]
                for connection in related_connections:
                    if connection == websocket:
                        obj["websockets"].remove(websocket)

    def addNewConnectionId(self, id: str):
        self.ids.append(id)
        obj = {
            "id": id,
            "websockets": [],
            "user_names": []
        }
        self.connections.append(obj)
        print(self.connections)

    def verifyConnectionId(self, id: str):
        if (id in self.ids):
            return True
        return False

    def removeConnectionId(self, id: str):
        self.ids.remove(id)        

    def splitId(self, id: str):
        unique_id = ""
        user_name = ""
        if "-" in id:
            x = id.split("-", 1)  
            unique_id = x[0]
            user_name = x[1]  
        return [unique_id, user_name]

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"version": "0.1", "name": "Tic-Tac-Toe-backend"}


@app.get("/getNewRoom")
def get_new_room_id():
    val = str(int(time.time()))
    manager.addNewConnectionId(val)
    return val

@app.websocket("/ws/{client_id}")
async def chat_room(websocket: WebSocket, client_id: str):
    [unique_id, user_name] = manager.splitId(client_id)
    val = manager.verifyConnectionId(unique_id)
    if val == False:
        print("Bad Request")
    await manager.connect(websocket, unique_id, user_name)
    while True:
        try:
            data = await websocket.receive_text()
            data = json.loads(data)
            data["client_name"] = user_name
            await manager.broadcast(unique_id, json.dumps(data))
        except Exception as e:
            manager.closeConnection(unique_id, websocket)
            print("Error :", e)
            break

    print("Bye")

chat_manager = ConnectionManager()

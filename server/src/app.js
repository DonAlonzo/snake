const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");

const INDEX_FILE = path.resolve("../client/index.html");
const SCRIPT_FILE = path.resolve("../client/script.js");

const app = express();

app.get('/', (req, res) => {
  res.sendFile(INDEX_FILE);
});

app.get('/script.js', (req, res) => {
  res.sendFile(SCRIPT_FILE);
});

const server = http.createServer(app);

new WebSocket.Server({ server })
  .on("connection", (ws, req) => {
    console.log(`Got connection: ${req.url}`);

    ws.on("message", data => {
      console.log(`Got message: ${data}`);
      
      ws.send(data, error => {
        if (error) {
          console.error(`Failed to send message: ${error}`);
        }
      });
    });
  });

server.listen(3000);

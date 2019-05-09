console.log("Connecting to server...");

const ws = new WebSocket("ws://boman.io:3000/asdasd");

ws.onopen = () => {
  console.log("Connected to server.");

  ws.send("Hey hey hey");
};

ws.onmessage = message => {
  console.log(message);
};

ws.onerror = error => {
  console.error(error);
};

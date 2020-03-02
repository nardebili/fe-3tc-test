var WSS = require("ws").Server;

// Start the server
var wss = new WSS({ port: 8080 });

const messages = [];

// When a connection is established
wss.on("connection", function(socket) {
  console.log("Opened connection ");

  // Send data back to the client
  var json = JSON.stringify({ message: "Gotcha" });
  socket.send(json);

  // When data is received
  socket.on("message", function(message) {
    console.log("Received: " + message);
    messages.push(message);
    broadcast();
  });

  // The connection was closed
  socket.on("close", function() {
    console.log("Closed Connection ");
  });
});

var broadcast = function() {
  var json = JSON.stringify({
    messages
  });

  // wss.clients is an array of all connected clients
  wss.clients.forEach(function each(client) {
    client.send(json);
    console.log("Sent: " + json);
  });
};
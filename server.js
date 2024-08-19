const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB Connection
mongoose.connect('mongodb://localhost/realtime-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Chat schema and model
const chatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

// Serve static files from the public directory
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // Send chat history to the newly connected user
  Chat.find().limit(50).sort({ timestamp: 1 }).then((messages) => {
    socket.emit('chat history', messages);
  });

  // Listen for incoming messages
  socket.on('chat message', (msg) => {
    const chatMessage = new Chat({ username: msg.username, message: msg.message });
    chatMessage.save().then(() => {
      io.emit('chat message', msg); // Broadcast the message to all connected users
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
node server.js

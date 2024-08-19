const socket = io();

const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send');

// Handle incoming messages
socket.on('chat message', (msg) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${msg.username}: ${msg.message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Load chat history
socket.on('chat history', (messages) => {
  messages.forEach((msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.username}: ${msg.message}`;
    chatMessages.appendChild(messageElement);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Send a message when the button is clicked
sendButton.addEventListener('click', () => {
  const msg = {
    username: usernameInput.value,
    message: messageInput.value,
  };
  socket.emit('chat message', msg);
  messageInput.value = '';
});

// Send a message when the Enter key is pressed
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

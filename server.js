const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with 25MB max payload for images
const io = new Server(server, {
  maxHttpBufferSize: 25 * 1024 * 1024,
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

// In-memory messages with file fallback
let messages = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    messages = JSON.parse(raw);
  }
} catch (e) {
  console.error('Could not load existing messages:', e.message);
  messages = [];
}

function saveMessages() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages.slice(-100), null, 2));
  } catch (e) {
    console.error('Error saving messages:', e.message);
  }
}

app.use(express.static(path.join(__dirname, 'public')));

let onlineCount = 0;

io.on('connection', (socket) => {
  onlineCount++;
  io.emit('online-count', onlineCount);

  // Send history to newly connected device
  socket.emit('init-history', messages);

  // Handle incoming message or photo
  socket.on('send-message', (data) => {
    const message = {
      id: Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      senderId: socket.id,
      name: data.name || 'Anonymous',
      text: data.text || '',
      image: data.image || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    messages.push(message);
    if (messages.length > 200) messages.shift();
    saveMessages();

    // Broadcast to all connected devices including sender
    io.emit('new-message', message);
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('user-typing', data);
  });

  // Handle wipe/clear history
  socket.on('clear-chat', () => {
    messages = [];
    saveMessages();
    io.emit('chat-cleared');
  });

  socket.on('disconnect', () => {
    onlineCount = Math.max(0, onlineCount - 1);
    io.emit('online-count', onlineCount);
  });
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`⚡ Zero-Auth Hotline Chat is running!`);
  console.log(`💻 On this PC:          http://localhost:${PORT}`);
  console.log(`📱 From phone/other PC: http://${localIp}:${PORT}`);
  console.log(`======================================================\n`);
});

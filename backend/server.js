import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Join a specific room
  socket.on('joinRoom', async ({ roomName, userName }) => {
    await socket.join(roomName);
    console.log(`${userName} joined ${roomName}`);
    // Notify other users in that room
    socket.to(roomName).emit('roomNotice', userName);
  });

  socket.on('chatMessage', ({ roomName, msg }) => {
    socket.to(roomName).emit('chatMessage', msg);
  });

  socket.on('typing', ({ roomName, userName }) => {
    socket.to(roomName).emit('typing', userName);
  });

  socket.on('stopTyping', ({ roomName, userName }) => {
    socket.to(roomName).emit('stopTyping', userName);
  });
});

server.listen(4600, () => {
//   console.log('server running at http://localhost:4600');
});

import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const ROOM = "group";
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

  socket.on('joinRoom', async (userName) => {
    // console.log(`${userName} joined the room`);

    await socket.join(ROOM);

    // send to all
    // io.to(ROOM).emit('roomNotice', userName);

    // Broadcast to all except the sender
    socket.to(ROOM).emit('roomNotice', userName);
  });

  socket.on('chatMessage', (msg) => {
    socket.to(ROOM).emit('chatMessage', msg);
  });

  socket.on('typing', (userName) => {
    socket.to(ROOM).emit('typing', userName);
  });
  
  socket.on('stopTyping', (userName) => {
    socket.to(ROOM).emit('stopTyping', userName);
  });
});

server.listen(4600, () => {
//   console.log('server running at http://localhost:4600');
});

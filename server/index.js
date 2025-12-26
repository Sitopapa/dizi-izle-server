const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Eklentiden gelen isteklere izin ver
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Socket Sunucusu Çalışıyor</h1>');
});

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Kullanıcı ${socket.id} odaya katıldı: ${roomId}`);
  });

  socket.on('sync_event', (data) => {
    // data: { roomId, type: 'play' | 'pause' | 'seek', currentTime, timestamp }
    // Odaya (kendisi hariç) yayını yap
    socket.to(data.roomId).emit('sync_event', data);
    console.log(`Event in room ${data.roomId}: ${data.type} at ${data.currentTime}`);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

import { io } from './io'

io.of('/').on('connection', socket => {
  socket.on('ping', () => {
    socket.emit('ping', 'PONG')
  })
})
import {
  io,
  type Socket
} from 'https://cdn.socket.io/4.5.3/socket.io.esm.min.js'

const socket: Socket = io('/')

socket.emit('ping')

socket.on('ping', console.log)

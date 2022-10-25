import type { io, Socket } from 'socket.io-client'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const socket: Socket = io('/')

socket.emit('ping')

socket.on('ping', console.log)
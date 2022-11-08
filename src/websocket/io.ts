import { Server } from 'socket.io'
import { server as httpServer } from '../server'
import { session } from '../middlewares'
import sharedSession from 'express-socket.io-session'

const io = new Server(httpServer, { serveClient: false })

io.use(sharedSession(session))

export { io }

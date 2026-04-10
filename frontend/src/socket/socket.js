import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000', {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
})

export default socket
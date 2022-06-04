import { Server } from 'socket.io';
import log from '../utils/logger';
import { roomHandler } from './room';
function socket({ io }: { io: Server }) {
  io.on('connection', (socket) => {
    log.info('a user connected');
    roomHandler(socket);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}
export default socket;

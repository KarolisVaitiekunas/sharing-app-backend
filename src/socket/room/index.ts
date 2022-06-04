import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import EVENTS from '../../../config/events';

const rooms: Record<string, string[]> = {};

interface IroomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidv4();
    rooms[roomId] = [];
    socket.join(roomId);
    socket.emit(EVENTS.SERVER.ROOM_CREATED, { roomId });
  };

  const joinRoom = ({ roomId, peerId }: IroomParams) => {
    console.log('USER ', peerId, ' JOINED ', roomId);
    //only join room if it exists
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { peerId });
      socket.emit(EVENTS.SERVER.GET_USERS, {
        roomId,
        participants: rooms[roomId],
      });

      socket.on('disconnect', () => {
        leaveRoom({ roomId, peerId });
      });
    }
  };

  const leaveRoom = ({ peerId, roomId }: IroomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.to(roomId).emit(EVENTS.SERVER.USER_DISCONNECTED, peerId);
  };

  const startSharing = ({ peerId, roomId }: IroomParams) => {
    console.log('start sharing', peerId, ' room ', roomId);
    socket.to(roomId).emit(EVENTS.SERVER.USER_SHARED_SCREEN, peerId);
  };

  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit(EVENTS.SERVER.USER_STOPPED_SHARING);
  };

  socket.on(EVENTS.CLIENT.CREATE_ROOM, createRoom);
  socket.on(EVENTS.CLIENT.JOIN_ROOM, joinRoom);
  socket.on(EVENTS.CLIENT.START_SHARING, startSharing);
  socket.on(EVENTS.CLIENT.STOP_SHARING, stopSharing);
};

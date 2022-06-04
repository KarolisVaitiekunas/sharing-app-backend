const EVENTS = {
  CLIENT: {
    CREATE_ROOM: 'create-room',
    JOIN_ROOM: 'join-room',
    START_SHARING: 'start-sharing',
    STOP_SHARING: 'stop-sharing',
  },
  SERVER: {
    GET_USERS: 'get-users',
    ROOM_CREATED: ' room-created',
    USER_DISCONNECTED: 'user-disconnected',
    USER_SHARED_SCREEN: 'user-shared-screen',
    USER_STOPPED_SHARING: 'user-stopped-sharing',
    USER_JOINED: 'user-joined',

    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};

export default EVENTS;

import 'express-async-errors';

import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

import helmet from 'helmet';
import cors from 'cors';

import globalErrorHandler from './utils/errorHandling';
import router from './routes/index';
import config from 'config';
import dotenv from 'dotenv';
import log from './utils/logger';
import deserializeUser from './middleware/deserializeUser';
import socket from './socket';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'frontend-app',
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(deserializeUser);

app.use(router);

app.use(globalErrorHandler);

const serverPort = config.get<number>('server_port');
const serverHost = config.get<string>('server_host');

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

httpServer.listen(serverPort, () => {
  log.info(`http://${serverHost}:${serverPort}`);

  socket({ io });
});

import dotenv from 'dotenv';
dotenv.config();
export default {
  server_port: process.env.SERVER_PORT,
  server_host: process.env.SERVER_HOST,
  client_port: process.env.CLIENT_PORT,
  client_host: process.env.CLIENT_HOST,

  logLevel: 'info',

  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,

  ORIGIN: process.env.ORIGIN,
};

import { Session, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { findSessionById, findUserById, signAccessToken } from '../service/auth.service';
import getCookie from '../utils/getCookie';
import { verifyJwt } from '../utils/jwt';
import redis from '../utils/redis';
import redisGetObject from '../utils/redisGetObject';
import { omit } from 'lodash';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = getCookie('access-token', req);
  const refreshToken = getCookie('refresh-token', req);

  if (!accessToken || !refreshToken) {
    return next();
  }

  // see if accesstoken is valid
  const decodedAccess = verifyJwt<{
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
    iat: number;
    exp: number;
  }>(accessToken, 'accessTokenPublicKey');

  if (decodedAccess) {
    res.locals.user = omit(decodedAccess, 'iat', 'exp');
    await redis.setex(`user:${res.locals.user.id}`, 31556926, JSON.stringify(res.locals.user));
    return next();
  }

  // see if refresh token is valid
  const decodedRefesh = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey');

  if (!decodedRefesh) {
    return next();
  }

  // try to get session with redis, if fails try with mysql
  let session = await redisGetObject<Session>(`session:${decodedRefesh.session}`);

  if (!session || !session.valid) {
    session = await findSessionById(decodedRefesh.session);
  }

  if (!session || !session.valid) {
    return next();
  }

  let user = null;

  if (!user) {
    user = await findUserById(session.userId);
    if (!user) {
      return next();
    }

    await redis.setex(`user:${user.id}`, 31556926, JSON.stringify(omit(user, 'password')));
  }

  // generating new token
  const newaccessToken = signAccessToken(user);

  res.locals.user = user;

  res.cookie('access-token', newaccessToken, {
    maxAge: 2147483647 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  });

  return next();
};

export default deserializeUser;

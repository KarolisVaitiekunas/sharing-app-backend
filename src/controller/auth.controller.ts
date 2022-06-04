import { Prisma } from '@prisma/client';
import { RequestHandler } from 'express';
import { createSession, findUserByEmail, signAccessToken, signRefreshToken } from '../service/auth.service';

import { validatePassword } from '../utils/validatePassword';
import createError from 'http-errors';
import redis from '../utils/redis';

export const createSessionHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const message = 'Neteisingas slaptažodis arba paštas.';

  const user: Prisma.UserUncheckedCreateInput | null = await findUserByEmail(email);

  if (!user) {
    return new createError.Unauthorized(message);
  }

  const isValid = await validatePassword(user.password, password);
  if (!isValid) {
    return new createError.Forbidden(message);
  }

  // create session
  const session = await createSession(user);

  const accessToken = await signAccessToken(user);
  // sign a refresh token

  const refreshToken = await signRefreshToken(session.id);
  // send the tokens

  // Delete sensitive information
  delete user.password;

  await redis.setex(`session:${session.id}`, 31556926, JSON.stringify(session));

  console.log('access ', accessToken);
  console.log('refresh ', refreshToken);

  res
    .cookie('refresh-token', refreshToken, {
      maxAge: 2147483647 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    })
    .cookie('access-token', accessToken, {
      maxAge: 2147483647 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

  return res.status(200).json({
    success: true,
    data: { message: 'Sėkmingai prisijungta.', payload: user },
  });
};

export const getCurrentSession: RequestHandler = async (req, res) => {
  return res.status(200).json({ success: true, data: { message: 'User auth verified', payload: res.locals.user } });
};

export const logoutSessionHandler: RequestHandler = async (req, res) => {
  res.locals.user = null;

  return res
    .clearCookie('access-token')
    .clearCookie('refresh-token')
    .status(204)
    .json({
      success: true,
      data: {
        message: 'User logged out',
      },
    });
};

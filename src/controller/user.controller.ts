import { RequestHandler } from 'express';
import { createUser } from '../service/user.service';
import hashPassword from '../utils/hashPassword';

export const createUserHandler: RequestHandler = async (req, res) => {
  const { password, ...body } = req.body;

  const hashedPassword = await hashPassword(password);

  // not checking if user exist because there is already a proprety in model that says usename must be unique, which we have also handled in global error handler
  await createUser({ ...body, password: hashedPassword });

  return res.status(200).json({ success: false, data: { message: 'User registered, check your email to verify.' } });
};

export const getCurrentUserHandler: RequestHandler = async (req, res) => {
  return res.json({ success: true, data: res.locals.user });
};

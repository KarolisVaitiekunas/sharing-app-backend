import argon2 from 'argon2';
import log from './logger';
export const validatePassword = async (password: string, incomingPassword: string) => {
  try {
    return await argon2.verify(password, incomingPassword);
  } catch (error) {
    log.error(error, 'Could no validate password');
  }
};

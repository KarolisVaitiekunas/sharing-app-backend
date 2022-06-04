import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return next(new createError.Unauthorized('User not authenticated.'));
  }

  return next();
};

export default requireUser;

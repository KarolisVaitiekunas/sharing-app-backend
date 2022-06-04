import express from 'express';
import { createUserHandler, getCurrentUserHandler } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

router.post('/api/user/register', createUserHandler);

router.get('/api/users/me', requireUser, getCurrentUserHandler);

export default router;

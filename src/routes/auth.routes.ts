import express from 'express';
import { createSessionHandler, getCurrentSession, logoutSessionHandler } from '../controller/auth.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

router.post('/api/auth/login', createSessionHandler);

router.get('/api/user/check', requireUser, getCurrentSession);

router.get('/api/auth/logout', requireUser, logoutSessionHandler);

export default router;

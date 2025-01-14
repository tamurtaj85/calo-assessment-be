import express from 'express';
import { authenticate, getTeamCreationStatus } from './controller.js';
import { authenticateTokenMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/authenticate', authenticate);
router.get(
  '/teamCreationStatus',
  authenticateTokenMiddleware,
  getTeamCreationStatus,
);

export default router;

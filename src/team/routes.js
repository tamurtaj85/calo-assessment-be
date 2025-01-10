import express from 'express';
import { getUserTeam } from './controller.js';

const router = express.Router();

router.route('').get(getUserTeam);

export default router;

import express from 'express';
import { delistPlayerOnMarket, listPlayerOnMarket } from './controller.js';

const router = express.Router();

router.patch('/listOnMarket/:playerId', listPlayerOnMarket);
router.get('/delistOnMarket/:playerId', delistPlayerOnMarket);

export default router;

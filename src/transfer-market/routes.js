import express from 'express';
import { buyPlayer, getTransferMarketData } from './controller.js';

const router = express.Router();

router.get('', getTransferMarketData);
router.patch('/buyPlayer/:playerId', buyPlayer);

export default router;

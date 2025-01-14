import express from 'express';
import { buyPlayer, getTransferMarketData } from './controller.js';

const router = express.Router();

router.get('', getTransferMarketData);
router.get('/buyPlayer', buyPlayer);

export default router;

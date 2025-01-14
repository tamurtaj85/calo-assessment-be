import express from 'express';
import { delistPlayerOnMarket, listPlayerOnMarket } from './controller.js';

const router = express.Router();

router.patch('/listOnMarket', listPlayerOnMarket);
router.get('/delistOnMarket', delistPlayerOnMarket);

export default router;

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { authenticateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { PlayerRoutes } from '../player/index.js';
import { TeamRoutes } from '../team/index.js';
import { TransferMarketRoutes } from '../transfer-market/index.js';
import { UserRoutes } from '../user/index.js';

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// health check
app.get('/health', (req, res) =>
  res.status(200).send('App is up and running!'),
);

// app routes
app.use('/user', UserRoutes);
app.use('/team', authenticateTokenMiddleware, TeamRoutes);
app.use('/player', authenticateTokenMiddleware, PlayerRoutes);
app.use('/transferMarket', authenticateTokenMiddleware, TransferMarketRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

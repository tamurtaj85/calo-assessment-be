import mongoose, { Schema } from 'mongoose';
import { DEFAULT_TEAM_BUDGET } from '../constants/index.js';

const teamSchema = new mongoose.Schema(
  {
    name: String,
    budget: { type: Number, default: DEFAULT_TEAM_BUDGET },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true },
);

export const TeamModel = mongoose.model('Team', teamSchema);

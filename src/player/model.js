import mongoose from 'mongoose';
import { PLAYER_POSITION_TYPE_ENUM } from '../constants/index.js';
import { objectValues } from '../utils/app.utils.js';

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: {
      type: String,
      enum: objectValues(PLAYER_POSITION_TYPE_ENUM),
      required: true,
    },
    onTransferList: { type: Boolean, default: false },
    price: { type: Number, min: 0, required: true },
    askingPrice: { type: Number, min: 0 },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

export const PlayerModel = mongoose.model('Player', playerSchema);

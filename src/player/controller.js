import { TEAM_SIZE } from '../constants/index.js';
import { PlayerModel } from './model.js';

export const listPlayerOnMarket = async (req, res) => {
  try {
    const { playerId } = req.query;
    const { askingPrice } = req.body;

    if (!playerId) return res.status(400).send('Player Id is not provided');

    const player = await PlayerModel.findById(playerId);

    if (!player) return res.status(404).send('Player not found!');

    const players = await PlayerModel.find({
      team: player.team,
      onTransferList: false,
    });

    if (players.length <= TEAM_SIZE.MIN)
      return res
        .status(403)
        .send(
          "Can't list any more player on market! Minimum team size reached!",
        );

    player.onTransferList = true;
    player.askingPrice = askingPrice;

    const updatedPlayer = await player.save();

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

export const delistPlayerOnMarket = async (req, res) => {
  try {
    const { playerId } = req.query;

    if (!playerId) return res.status(400).send('Player Id is not provided');

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
      { _id: playerId },
      { onTransferList: false, askingPrice: null },
      { new: true },
    );

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

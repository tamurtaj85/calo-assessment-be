import { PlayerModel } from './model.js';

export const listPlayerOnMarket = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { askingPrice } = req.body;

    const updatedPlayer = await PlayerModel.findOneAndUpdate(
      { _id: playerId },
      { onTransferList: true, askingPrice },
      { new: true },
    );

    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

export const delistPlayerOnMarket = async (req, res) => {
  try {
    const { playerId } = req.params;

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

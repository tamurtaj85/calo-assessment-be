import { TeamModel } from './model.js';
import { UserModel } from '../user/model.js';

export const getUserTeam = async (req, res) => {
  try {
    const user = req?.user;

    const team = await TeamModel.findOne({ user: user?._id }).populate(
      'players',
      '-createdAt -updatedAt',
    );

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

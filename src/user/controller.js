import { faker } from '@faker-js/faker';
import { DEFAULT_TEAM_SIZE } from '../constants/index.js';
import { PlayerModel } from '../player/model.js';
import { TeamModel } from '../team/model.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.utils.js';
import { generateAccessToken } from '../utils/jwt.utils.js';
import { UserModel } from './model.js';

export const authenticate = async (req, res) => {
  try {
    const { email, password: userPassword } = req.body;

    const user = await UserModel.findOne({ email }).lean();

    // if user doesn't exists
    if (!user) {
      const newUser = await UserModel.create({
        email,
        password: await hashPassword(userPassword),
      });

      // initiate team creation process separately don't wait for it to complete
      initiateTeamCreationProcess(newUser._id);

      return res
        .status(201)
        .json({ user: newUser, ...generateAccessToken(newUser) });
    }

    // check password validity
    const isMatch = await comparePassword(userPassword, user.password);

    if (!isMatch)
      return res.status(400).send('Provided password is incorrect!');

    // fail safe check if by any chance team creation fails in first place
    if (!user.teamCreated) initiateTeamCreationProcess(newUser._id);

    res.status(200).json({ user, ...generateAccessToken(user) });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

const initiateTeamCreationProcess = async (payload) => {
  try {
    // create a new team
    const newTeam = new TeamModel({
      name: faker.word.sample() + ' ' + faker.company.buzzNoun(),
      user: payload,
    });

    // create players
    for (const key in DEFAULT_TEAM_SIZE) {
      const membersCount = DEFAULT_TEAM_SIZE[key];

      for (let index = 0; index < membersCount; index++) {
        const newPlayer = await PlayerModel.create({
          name: faker.person.fullName() + ' - ' + `${key[0]}${index + 1}`,
          position: key,
          price: faker.number.int({ min: 500000, max: 1000000 }),
          team: newTeam._id,
        });

        newTeam.players.push(newPlayer._id);
      }
    }

    // save team
    await newTeam.save();
    // update the status so that the team can be fetched
    await UserModel.findByIdAndUpdate(payload, { teamCreated: true });
  } catch (error) {
    throw error;
  }
};

export const getTeamCreationStatus = async (req, res) => {
  try {
    const user = req?.user;

    const status = await UserModel.findById(user?._id, 'teamCreated');

    res.status(200).json({ status: status?.teamCreated });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

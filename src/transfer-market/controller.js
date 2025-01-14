import mongoose from 'mongoose';
import { TEAM_SIZE } from '../constants/index.js';
import { PlayerModel } from '../player/model.js';
import { TeamModel } from '../team/model.js';
import { calculatePaginationProps, calculateSkip } from '../utils/app.utils.js';

export const getTransferMarketData = async (req, res) => {
  try {
    const { query } = req;

    const { teamName, playerName, askingPrice, limit = 10, page = 1 } = query;

    const pipelineResults = await PlayerModel.aggregate([
      // First do the join with teams collection
      {
        $lookup: {
          from: 'teams', // Your teams collection name
          localField: 'team',
          foreignField: '_id',
          as: 'teamData',
        },
      },
      // Unwind the teamData array (created by lookup)
      {
        $unwind: '$teamData',
      },
      // Now we can filter on all fields
      {
        $match: {
          ...(teamName && {
            'teamData.name': { $regex: new RegExp(teamName, 'i') },
          }),
          ...(playerName && { name: { $regex: new RegExp(playerName, 'i') } }),
          ...(askingPrice && {
            askingPrice: { $lte: parseFloat(askingPrice) },
          }),
          onTransferList: true,
        },
      },
      // Use $facet to get both data and count in one query
      {
        $facet: {
          data: [
            { $sort: { updatedAt: -1 } },
            { $skip: calculateSkip(page, limit) },
            { $limit: +limit },
            {
              $project: {
                _id: 1,
                name: 1,
                askingPrice: 1,
                onTransferList: 1,
                position: 1,
                price: 1,
                team: {
                  _id: '$teamData._id',
                  name: '$teamData.name',
                },
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const [{ data, totalCount }] = pipelineResults;

    const count = totalCount[0]?.count;

    res.status(200).json({
      marketData: data,
      ...calculatePaginationProps(count, limit),
    });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};

export const buyPlayer = async (req, res) => {
  // start transaction so that we have system stability
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { playerId } = req.query;

    if (!playerId) return res.status(400).send('Player Id is not provided');

    const user = req?.user;

    const playerOnSale = await PlayerModel.findById(playerId).populate('team');

    const buyerTeam = await TeamModel.findOne({ user: user?._id }).populate(
      'players',
    );

    if (!playerId) return res.status(404).send('Player not found!');
    if (!buyerTeam) return res.status(404).send('Team not found!');

    // if user tries to buy the same player already in their team
    if (playerOnSale.team._id.equals(buyerTeam._id))
      return res.status(403).send('Player already owned by your team!');

    // if player is not on the transfer market
    if (!playerOnSale.onTransferList)
      return res.status(404).send('Player not listed on the transfer market!');

    // if buyer team has reached their maximum capacity
    if (buyerTeam.players.length >= TEAM_SIZE.MAX)
      return res.status(403).send('Your team reached its maximum capacity!');

    // if buyer team does not have enough funds
    // Calculate 95% of asking price
    const purchasePrice = +parseFloat(playerOnSale.askingPrice * 0.95).toFixed(
      2,
    );

    if (buyerTeam.budget < purchasePrice)
      return res
        .status(403)
        .send(
          `Insufficient funds! Available: ${buyerTeam.budget}, Required: ${purchasePrice}`,
        );

    // update player and team data
    // seller team: update the team budget, remove the player from the team
    const sellerTeam = playerOnSale.team;

    sellerTeam.players = sellerTeam.players.filter(
      (player) => !player._id.equals(playerOnSale._id),
    );

    sellerTeam.budget += purchasePrice;
    await sellerTeam.save({ session });

    // update the player
    playerOnSale.onTransferList = false;
    playerOnSale.askingPrice = null;
    playerOnSale.price = purchasePrice;
    playerOnSale.team = buyerTeam._id;
    await playerOnSale.save({ session });

    // update the buyer team
    buyerTeam.players.push(playerOnSale._id);
    buyerTeam.budget -= purchasePrice;
    await buyerTeam.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      buyerTeam,
      sellerTeam,
      playerOnSale,
    });
  } catch (error) {
    session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

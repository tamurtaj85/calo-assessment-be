import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_KEY } from '../constants/index.js';

export const generateAccessToken = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Payload is required and must be a plain object');
  }

  const parsedData = JSON.parse(JSON.stringify(data));

  // delete any sensitive information before signing
  data?.password && delete data.password;

  const accessToken = jwt.sign(parsedData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY ?? '1d',
  });

  return { [ACCESS_TOKEN_KEY]: accessToken };
};

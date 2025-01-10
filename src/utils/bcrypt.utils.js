import bcryptjs from 'bcryptjs';

const saltRounds = 10;

export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

import { config } from 'dotenv';

config();

export const AUTH_CONSTANTS = {
  jwt: {
    secret: process.env.APP_AUTH_SECRET,
    expiresIn: '60s',
    refreshTokenSecret: process.env.APP_AUTH_REFRESH_SECRET,
    refreshTokenExpiresIn: '7d',
  },
};

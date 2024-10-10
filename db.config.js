import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

// import path from 'path';
// dotenv.config({ path: path.join(process.cwd(), '.env') });

export const db = {
  NAME: process.env.DB_NAME,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,

  options: {
    dialect: process.env.DB_DIALECT,
    timezone: process.env.DB_TIMEZONE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: function (str) {
      console.log(str);
    },
  },
};

export const sequelize = new Sequelize(
  db.NAME,
  db.USERNAME,
  db.PASSWORD,
  db.options
);

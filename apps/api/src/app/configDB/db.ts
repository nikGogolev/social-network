import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('social-network', 'user', 'user', {
  host: 'localhost',
  dialect: 'postgres',
});

import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('social-network', 'snuser', 'snuser', {
  host: 'localhost',
  dialect: 'postgres',
});

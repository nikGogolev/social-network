import { User } from './users';
import { Profile } from './profiles';
import { sequelize } from '../configDB/db';

User.hasOne(Profile, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});
Profile.belongsTo(User, {
  foreignKey: 'userId',
});

export const runDB = async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

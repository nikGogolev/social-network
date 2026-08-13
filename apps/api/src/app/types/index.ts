import { User } from './users';
import { Profile } from './profiles';
import { FriendRequests } from './friendRequests';
import { Messages } from './messages';
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

// Ensure models are registered before sync
void FriendRequests;
void Messages;

export const runDB = async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

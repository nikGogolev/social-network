import { DataTypes } from 'sequelize';
import { sequelize } from '../configDB/db';

export const FriendRequests = sequelize.define(
  'friendrequests',
  {
    initiatorId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    targetId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['requested', 'approved', 'declined', 'unfriended'],
    },
  },
  {
    timestamps: false,
  }
);

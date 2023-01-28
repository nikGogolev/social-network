import { DataTypes } from 'sequelize';
import { sequelize } from '../configDB/db';

export const Messages = sequelize.define(
  'messages',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    fromUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    toUserId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: false,
    },
  },
  {
    timestamps: false,
  }
);

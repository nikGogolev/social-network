import { DataTypes } from 'sequelize';
import { sequelize } from '../configDB/db';

export const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    createDate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pwdHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  },
  {
    timestamps: false,
  }
);

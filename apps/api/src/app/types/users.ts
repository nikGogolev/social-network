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
      type: DataTypes.CHAR,
      allowNull: false,
      unique: false,
    },
    lastName: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: false,
    },
    createDate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: true,
    },
    pwdHash: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: false,
    },
    token: {
      type: DataTypes.CHAR,
      allowNull: false,
      unique: false,
    },
  },
  {
    timestamps: false,
  }
);

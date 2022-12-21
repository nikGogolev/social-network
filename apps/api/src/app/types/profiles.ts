import { DataTypes } from 'sequelize';
import { sequelize } from '../configDB/db';

export const Profile = sequelize.define(
  'profiles',
  {
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: true,
      unique: false,
    },
    country: {
      type: DataTypes.CHAR,
      allowNull: true,
      unique: false,
    },
    hometown: {
      type: DataTypes.CHAR,
      allowNull: true,
      unique: false,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      unique: false,
    },
    photo: {
      type: DataTypes.CHAR,
      allowNull: true,
      unique: false,
    },
  },
  {
    timestamps: false,
  }
);

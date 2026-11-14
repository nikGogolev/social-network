import { DataTypes } from 'sequelize';
import { sequelize } from '../configDB/db';

export const Profile = sequelize.define(
  'profiles',
  {
    userId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      // Must match users.id — not auto-incremented independently
      autoIncrement: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    hometown: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      unique: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  {
    timestamps: false,
  }
);

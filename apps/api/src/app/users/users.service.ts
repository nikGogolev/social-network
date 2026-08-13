import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Profile } from '../types/profiles';
import { User } from '../types/users';

@Injectable()
export class UsersService {
  async getAll(idxs) {
    try {
      const ids = idxs
        ? String(idxs)
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : null;

      const dbResponse = await User.findAll({
        ...(ids ? { where: { id: ids } } : {}),
        include: [{ model: Profile, required: false }],
        attributes: { exclude: ['pwdHash', 'token'] },
      });

      return { response: { status: STATUSES.SUCCESS, payload: dbResponse } };
    } catch (error) {
      console.log(error.message);
      return {
        response: {
          status: STATUSES.INTERNAL_ERROR,
          message: error.message,
        },
      };
    }
  }

  async getOne(id: string, cookies: object) {
    try {
      const dbResponse = await User.findOne({
        where: { id },
        include: [{ model: Profile, required: false }],
        attributes: { exclude: ['pwdHash', 'token'] },
      });

      if (!dbResponse?.dataValues) {
        return {
          response: {
            status: STATUSES.USER_NOT_EXIST,
            message: 'User not exist',
          },
        };
      }

      const findedUser: UserInterface = {
        ...(dbResponse.dataValues as unknown as UserInterface),
        owner: cookies?.['email'] === dbResponse.dataValues.email,
      };

      return {
        response: {
          status: STATUSES.SUCCESS,
          payload: findedUser,
        },
      };
    } catch (error) {
      return {
        response: {
          status: STATUSES.INTERNAL_ERROR,
          message: error.message,
        },
      };
    }
  }
}

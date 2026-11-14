import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { User } from '../types/users';

@Injectable()
export class AuthService {
  async auth(email, token) {
    try {
      if (!email || !token || email === 'undefined' || token === 'undefined') {
        return {
          response: {
            status: STATUSES.NOT_AUTHORIZED,
            message: 'You are not authorized',
          },
        };
      }

      const dbResponse = await User.findOne({
        where: { email },
      });

      if (!dbResponse?.dataValues) {
        return {
          response: {
            status: STATUSES.USER_NOT_EXIST,
            message: 'User not exist',
          },
        };
      }

      const findedUser: UserInterface = dbResponse.dataValues;
      if (token === findedUser.token) {
        const { pwdHash: _pwdHash, token: _token, ...safeUser } = findedUser;
        return {
          response: {
            status: STATUSES.SUCCESS,
            payload: safeUser,
          },
        };
      }

      return {
        response: {
          status: STATUSES.NOT_AUTHORIZED,
          message: 'You are not authorized',
        },
      };
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
}

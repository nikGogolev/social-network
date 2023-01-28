import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { User } from '../types/users';

@Injectable()
export class AuthService {
  async auth(email, token) {
    try {
      if (email) {
        const dbResponse = await User.findOne({
          where: { email: email },
        });

        const findedUser: UserInterface = dbResponse.dataValues;
        if (token === findedUser.token) {
          return {
            response: {
              status: STATUSES.SUCCESS,
              payload: findedUser,
            },
          };
        } else {
          return {
            response: {
              status: STATUSES.NOT_AUTHORIZED,
              message: 'You are not authorized',
            },
          };
        }
      } else {
        console.log('User not exist');
        return {
          response: {
            status: STATUSES.USER_NOT_EXIST,
            message: 'User not exist',
          },
        };
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

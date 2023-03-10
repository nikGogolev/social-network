import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Response } from 'express';
import { User } from './types/users';

const FRONT_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://188.225.27.34:4200'
    : 'http://localhost:4200';

@Injectable()
export class AppService {
  async getData(email, token, res: Response) {
    try {
      if (email) {
        const dbResponse = await User.findOne({
          where: { email: email },
        });

        const findedUser: UserInterface = dbResponse.dataValues;
        if (token === findedUser.token) {
          res.redirect(`${FRONT_URL}/users/${findedUser.id}`);
          return {
            response: {
              status: STATUSES.SUCCESS,
              payload: findedUser,
            },
          };
        } else {
          res.redirect(`${FRONT_URL}/login`);
          return {
            response: {
              status: STATUSES.PASSWORD_ERROR,
              message: 'You are not authorized',
            },
          };
        }
      } else {
        res.redirect(`${FRONT_URL}/signup`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

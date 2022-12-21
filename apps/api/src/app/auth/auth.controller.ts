import { Controller, Get, Req } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Request } from 'express';
import { User } from '../types/users';

@Controller('auth')
export class AuthController {
  @Get()
  async auth(@Req() req: Request) {
    const email = req.cookies['email'];
    const token = req.cookies['token'];

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

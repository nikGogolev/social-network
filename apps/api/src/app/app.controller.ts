import { Controller, Get, Req, Res } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Request, Response } from 'express';

import { AppService } from './app.service';
import { User } from './types/users';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData(@Req() req: Request, @Res() res: Response) {
    const email = req.cookies['email'];
    const token = req.cookies['token'];
    try {
      if (email) {
        const dbResponse = await User.findOne({
          where: { email: email },
        });

        const findedUser: UserInterface = dbResponse.dataValues;
        if (token === findedUser.token) {
          res.redirect(`http://188.225.27.34:4200/users/${findedUser.id}`);
          return {
            response: {
              status: STATUSES.SUCCESS,
              payload: findedUser,
            },
          };
        } else {
          res.redirect(`http://188.225.27.34:4200/login`);
          return {
            response: {
              status: STATUSES.PASSWORD_ERROR,
              message: 'You are not authorized',
            },
          };
        }
      } else {
        res.redirect(`http://188.225.27.34:4200/signup`);
      }
    } catch (error) {
      console.log(error.message);
    }

    return this.appService.getData();
  }
}

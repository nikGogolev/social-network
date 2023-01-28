import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Response } from 'express';
import { User } from '../types/users';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const dbResponse = await User.findOne({
        where: { email: loginUserDto.email },
      });
      if (dbResponse?.dataValues) {
        const findedUser: UserInterface = dbResponse?.dataValues;
        console.log('user exist');

        if (findedUser.pwdHash === loginUserDto.pwdHash) {
          res.cookie('token', dbResponse?.dataValues.token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.cookie('email', dbResponse?.dataValues.email, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.status(200).send({
            response: {
              status: STATUSES.SUCCESS,
              message: 'Login successfull',
              payload: { userId: findedUser.id },
            },
          });
        } else {
          res.status(200).send({
            response: {
              status: STATUSES.PASSWORD_ERROR,
              message: 'Wrong password',
            },
          });
        }
      } else {
        console.log('user not exist');
        res.status(200).send({
          response: {
            status: STATUSES.USER_NOT_EXIST,
            message: 'User not exist',
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

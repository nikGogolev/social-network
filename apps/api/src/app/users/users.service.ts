import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { UserInterface } from 'common/interfaces/UserInterface';
import { Profile } from '../types/profiles';
import { User } from '../types/users';

@Injectable()
export class UsersService {
  async getAll(idxs) {
    try {
      if (idxs) {
        const dbResponse = await User.findAll({
          include: [{ model: Profile, where: { userId: idxs.split(',') } }],
        });
        const findedUser = dbResponse;

        return { response: { status: STATUSES.SUCCESS, payload: findedUser } };
      }
      const dbResponse = await User.findAll({
        include: [{ model: Profile }],
      });
      const findedUser = dbResponse;
      return { response: { status: STATUSES.SUCCESS, payload: findedUser } };
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
        include: [{ model: Profile, where: { userId: id } }],
      });

      const findedUser: UserInterface = {
        ...(dbResponse.dataValues as unknown as UserInterface),
        owner: cookies['email'] === dbResponse.dataValues.email ? true : false,
      };
      // console.log(dbResponse.dataValues);
      // if (req.cookies['email'] === findedUser.email) {
      //   findedUser.owner = true;
      // } else {
      //   findedUser.owner = false;
      // }
      // console.log(findedUser);

      return {
        response: {
          status: STATUSES.SUCCESS,
          payload: findedUser,
        },
      };

      // if (req.cookies['token'] === findedUser.token) {
      //   return {
      //     response: {
      //       status: STATUSES.SUCCESS,
      //       payload: findedUser,
      //     },
      //   };
      // } else {
      //   return {
      //     response: {
      //       status: STATUSES.PASSWORD_ERROR,
      //       message: 'You are not authorized',
      //     },
      //   };
      // }
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

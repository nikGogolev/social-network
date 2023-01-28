import { Injectable } from '@nestjs/common';
import { FRIEND_REQUEST_STATUS, STATUSES } from 'common/constants';
import { FriendRequestInterface } from 'common/interfaces/FriendRequestInterface';
import { Op } from 'sequelize';
import { FriendRequests } from '../types/friendRequests';
import { FriendRequestDto } from './dto/friendRequest.dto';

@Injectable()
export class FriendRequestService {
  async friendRequest(body: FriendRequestDto) {
    try {
      const dbResponse = await FriendRequests.create({
        initiatorId: body.initiatorId,
        targetId: body.targetId,
        createAt: new Date().toLocaleString,
        status: FRIEND_REQUEST_STATUS.requested,
      });
      if (dbResponse.dataValues) {
        return {
          response: {
            status: STATUSES.SUCCESS,
            payload: { friendRequestStatus: FRIEND_REQUEST_STATUS.requested },
          },
        };
      }
    } catch (error) {
      return {
        response: { status: STATUSES.INTERNAL_ERROR, message: error.message },
      };
    }
  }

  async checkFriendRequestStatus(queryParams: FriendRequestDto) {
    try {
      const dbResponse = await FriendRequests.findOne({
        where: {
          initiatorId: queryParams.initiatorId,
          targetId: queryParams.targetId,
        },
      });
      if (dbResponse.dataValues) {
        const friendRequest: FriendRequestInterface =
          dbResponse.dataValues as FriendRequestInterface;
        return {
          response: {
            status: STATUSES.SUCCESS,
            payload: friendRequest,
          },
        };
      } else {
        return {
          response: {
            status: STATUSES.USER_NOT_EXIST,
            message: 'No such request',
          },
        };
      }
    } catch (error) {
      return {
        response: { status: STATUSES.INTERNAL_ERROR, message: error.message },
      };
    }
  }

  async findRequests(userId: string) {
    try {
      const dbResponse = await FriendRequests.findAll({
        where: {
          targetId: userId,
        },
      });

      if (dbResponse) {
        const friendRequest: FriendRequestInterface[] =
          dbResponse as unknown as FriendRequestInterface[];
        return {
          response: {
            status: STATUSES.SUCCESS,
            payload: friendRequest,
          },
        };
      }
    } catch (error) {
      return {
        response: { status: STATUSES.INTERNAL_ERROR, message: error.message },
      };
    }
  }

  async findFriends(userId: string) {
    try {
      const dbResponse = await FriendRequests.findAll({
        where: {
          [Op.and]: {
            [Op.or]: { targetId: userId, initiatorId: userId },
            status: FRIEND_REQUEST_STATUS.approved,
          },
        },
      });

      if (dbResponse) {
        const friendRequest: FriendRequestInterface[] =
          dbResponse as unknown as FriendRequestInterface[];
        return {
          response: {
            status: STATUSES.SUCCESS,
            payload: friendRequest,
          },
        };
      }
    } catch (error) {
      return {
        response: { status: STATUSES.INTERNAL_ERROR, message: error.message },
      };
    }
  }

  async updateFriendRequest(body: FriendRequestDto) {
    console.log(new Date().toDateString());
    try {
      const dbResponse = await FriendRequests.update(
        {
          updatedAt: new Date().toDateString(),
          status: body.status,
        },
        {
          where: {
            [Op.and]: [
              { initiatorId: body.initiatorId },
              { targetId: body.targetId },
            ],
          },
        }
      );
      console.log(dbResponse);
      if (dbResponse) {
        return { response: { status: STATUSES.SUCCESS, payload: dbResponse } };
      } else {
        return {
          response: {
            status: STATUSES.INTERNAL_ERROR,
            message: 'Wrong request',
          },
        };
      }
    } catch (error) {
      return {
        response: {
          status: STATUSES.INTERNAL_ERROR,
          message: 'internal server error',
        },
      };
    }
  }
}

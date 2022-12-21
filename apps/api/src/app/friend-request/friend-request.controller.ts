import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FRIEND_REQUEST_STATUS, STATUSES } from 'common/constants';
import { FriendRequests } from '../types/friendRequests';
import { FriendRequestInterface } from '../../../../../common/interfaces/FriendRequestInterface';
import { FriendRequestDto } from './dto/friendRequest.dto';
import { Op } from 'sequelize';

@Controller('friend-request')
export class FriendRequestController {
  @Post()
  async friendRequest(@Body() body: FriendRequestDto) {
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

  @Get()
  async checkFriendRequestStatus(@Query() queryParams: FriendRequestDto) {
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

  @Get('requests/:userId')
  async findRequests(@Param('userId') userId: string) {
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

  @Get('friends/:userId')
  async findFriends(@Param('userId') userId: string) {
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

  @Put()
  async updateFriendRequest(@Body() body: FriendRequestDto) {
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

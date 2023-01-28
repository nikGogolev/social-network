import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { Op } from 'sequelize';
import { Messages } from '../types/messages';
import { CreateMessageDto } from './dto/createMessage.dto';
import { GetMessagesDto } from './dto/getMessages.dto';

@Injectable()
export class MessagesService {
  async getMessages(body: GetMessagesDto) {
    try {
      const messages = await Messages.findAll({
        where: { [Op.or]: { fromUserId: body.id, toUserId: body.id } },
        offset: body.offset,
        limit: body.count,
        order: [['id', 'DESC']],
      });
      return {
        response: {
          status: STATUSES.SUCCESS,
          payload: messages,
        },
      };
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }

  async createMessage(body: CreateMessageDto) {
    try {
      const dbResponse = await Messages.create({
        fromUserId: body.fromId,
        toUserId: body.toId,
        body: body.text,
        createdAt: Number(new Date()),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

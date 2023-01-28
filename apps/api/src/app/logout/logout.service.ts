import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { Response } from 'express';

@Injectable()
export class LogoutService {
  async logout(res: Response) {
    res.cookie('token', '');
    res.send({
      response: {
        status: STATUSES.SUCCESS,
        message: 'Success logout',
      },
    });
  }
}

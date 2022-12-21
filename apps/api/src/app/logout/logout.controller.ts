import { Controller, Get, Res } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { Response } from 'express';

@Controller('logout')
export class LogoutController {
  @Get()
  async logout(@Res() res: Response) {
    res.cookie('token', '');
    res.send({
      response: {
        status: STATUSES.SUCCESS,
        message: 'Success logout',
      },
    });
  }
}

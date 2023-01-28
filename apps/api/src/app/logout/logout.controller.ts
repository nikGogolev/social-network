import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LogoutService } from './logout.service';

@Controller('logout')
export class LogoutController {
  constructor(private logoutService: LogoutService) {}
  @Get()
  async logout(@Res() res: Response) {
    this.logoutService.logout(res);
  }
}

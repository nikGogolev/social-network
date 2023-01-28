import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData(@Req() req: Request, @Res() res: Response) {
    const email = req.cookies['email'];
    const token = req.cookies['token'];
    this.appService.getData(email, token, res);
  }
}

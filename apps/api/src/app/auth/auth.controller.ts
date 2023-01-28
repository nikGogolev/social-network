import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get()
  async auth(@Req() req: Request) {
    const email = req.cookies['email'];
    const token = req.cookies['token'];

    return this.authService.auth(email, token);
  }
}

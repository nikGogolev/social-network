import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post()
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    this.loginService.login(loginUserDto, res);
  }
}

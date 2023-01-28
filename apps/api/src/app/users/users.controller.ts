import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  async getAll(@Query('idxs') idxs) {
    return this.userService.getAll(idxs);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Req() { cookies }: Request) {
    return this.userService.getOne(id, cookies);
  }
}

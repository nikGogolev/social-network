import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}
  @Post()
  async friendRequest(@Body() body) {
    return this.friendRequestService.friendRequest(body);
  }

  @Get()
  async checkFriendRequestStatus(@Query() queryParams) {
    return this.friendRequestService.checkFriendRequestStatus(queryParams);
  }

  @Get('requests/:userId')
  async findRequests(@Param('userId') userId: string) {
    return this.friendRequestService.findRequests(userId);
  }

  @Get('friends/:userId')
  async findFriends(@Param('userId') userId: string) {
    return this.friendRequestService.findFriends(userId);
  }

  @Put()
  async updateFriendRequest(@Body() body) {
    return this.friendRequestService.updateFriendRequest(body);
  }
}

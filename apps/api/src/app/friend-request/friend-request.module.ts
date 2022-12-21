import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';

@Module({
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}

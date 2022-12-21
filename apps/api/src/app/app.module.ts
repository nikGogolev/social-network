import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { LogoutController } from './logout/logout.controller';
import { AuthController } from './auth/auth.controller';
import { FriendRequestModule } from './friend-request/friend-request.module';

@Module({
  imports: [UsersModule, LoginModule, SignupModule, FriendRequestModule],
  controllers: [AppController, LogoutController, AuthController],
  providers: [AppService, UsersService],
})
export class AppModule {}

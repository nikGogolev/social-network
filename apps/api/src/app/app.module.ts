import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { AuthController } from './auth/auth.controller';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { LogoutModule } from './logout/logout.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    UsersModule,
    LoginModule,
    SignupModule,
    FriendRequestModule,
    FileModule,
    AuthModule,
    LogoutModule,
    MessagesModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, UsersService, AuthService],
})
export class AppModule {}

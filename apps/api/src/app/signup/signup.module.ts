import { Module } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';

@Module({
  controllers: [SignupController],
  providers: [SignupService, FileService],
})
export class SignupModule {}

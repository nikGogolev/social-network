import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { SignupProfileDto, SignupUserDto } from './signup.dto';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {
  constructor(private signupService: SignupService) {}
  @Post()
  async signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
    this.signupService.signup(signupUserDto, res);
  }

  @Post(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  async loadPhoto(
    @Param('id') id: string,
    // @UploadedFile() file: Express.Multer.File,
    @UploadedFiles() files,
    @Req() req: Request,
    @Body() body: SignupProfileDto
  ) {
    return this.signupService.loadPhoto(id, body, files);
  }
}

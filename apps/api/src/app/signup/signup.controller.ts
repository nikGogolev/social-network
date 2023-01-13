import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { STATUSES } from 'common/constants';
import { Request, Response } from 'express';
import { User } from '../types/users';
import { SignupProfileDto, SignupUserDto } from './signup.dto';
import { Express } from 'express';
import { imageFilter } from '../../helpers/imageFilter';
import { decodeBase64Image } from '../../helpers/decodeBase64Data';
import { mkdir } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { Profile } from '../types/profiles';
//import { STATUSES } from '../../../../../common/constants';

@Controller('signup')
export class SignupController {
  @Post()
  async signup(@Body() signupUserDto: SignupUserDto, @Res() res: Response) {
    try {
      const dbResponse = await User.findOne({
        where: { email: signupUserDto.email },
      });
      if (dbResponse?.dataValues) {
        console.log('user exist');
        res.status(200).send({
          response: {
            status: STATUSES.USER_EXIST,
            message: 'User already exist',
          },
        });
      } else {
        const token = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');

        const dbResponse = await User.create({
          firstName: signupUserDto.firstName,
          lastName: signupUserDto.lastName,
          createDate: +new Date(),
          email: signupUserDto.email,
          pwdHash: signupUserDto.pwdHash,
          token: token,
        });

        res.cookie('token', dbResponse?.dataValues.token, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.cookie('email', dbResponse?.dataValues.email, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.status(200).send({
          response: {
            status: STATUSES.SUCCESS,
            message: 'Signup successfull',
            payload: { userId: dbResponse.dataValues.id },
          },
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `./public`,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFilter,
    })
  )
  async loadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: SignupProfileDto
  ) {
    type Response = {
      type: string;
      data: Buffer;
    };
    const imageTypeRegularExpression = /\/(.*?)$/;

    const imageBuffer = decodeBase64Image(body.file) as Response;

    const imageTypeDetected = imageBuffer.type.match(
      imageTypeRegularExpression
    );

    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const userUploadedImagePath =
      './public/' +
      id +
      '/profilePhoto/' +
      randomName +
      '.' +
      imageTypeDetected[1];

    try {
      await mkdir(`./public/${id}/profilePhoto`, { recursive: true });
      await writeFile(userUploadedImagePath, imageBuffer.data);
    } catch (error) {
      console.log('ERROR:', error);
    }

    const dbImagePath =
      id + '/profilePhoto/' + randomName + '.' + imageTypeDetected[1];
    try {
      const dbResponse = await Profile.create({
        userId: id,
        country: body.country,
        hometown: body.hometown,
        gender: body.gender,
        birthdate: body.birthdate || '1970-01-01',
        photo: `http://188.225.27.34:3001/${dbImagePath}`,
      });
      if (dbResponse) {
        return { response: { status: STATUSES.SUCCESS } };
      } else {
        return {
          response: { status: STATUSES.INTERNAL_ERROR },
        };
      }
    } catch (error) {
      console.log(error.message);
      return {
        response: { status: STATUSES.INTERNAL_ERROR, message: error.message },
      };
    }
  }
}

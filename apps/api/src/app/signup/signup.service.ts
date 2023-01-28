import { Injectable } from '@nestjs/common';
import { STATUSES } from 'common/constants';
import { Response } from 'express';
import { FileService } from '../file/file.service';
import { Profile } from '../types/profiles';
import { User } from '../types/users';
import { SignupProfileDto, SignupUserDto } from './signup.dto';

@Injectable()
export class SignupService {
  constructor(private fileService: FileService) {}
  async signup(signupUserDto: SignupUserDto, res: Response) {
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

  async loadPhoto(id: string, body: SignupProfileDto, files) {
    const fileName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const path = './public/' + id + '/profilePhoto/';

    try {
      this.fileService.createFile(path, fileName, files.file[0]);
    } catch (error) {
      console.log('ERROR:', error);
    }

    const dbImagePath =
      id +
      '/profilePhoto/' +
      fileName +
      '.' +
      files.file[0].originalname.split('.').pop();
    try {
      const dbResponse = await Profile.create({
        userId: id,
        country: body.country,
        hometown: body.hometown,
        gender: body.gender,
        birthdate: body.birthdate || '1970-01-01',
        photo: `${
          process.env.NODE_ENV === 'production'
            ? 'http://188.225.27.34:3001'
            : 'http://localhost:3001'
        }/${dbImagePath}`,
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

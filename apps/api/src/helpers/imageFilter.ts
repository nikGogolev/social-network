import { InternalServerErrorException } from '@nestjs/common';

export const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    console.log('file ok');

    cb(null, true);
  } else {
    cb(new InternalServerErrorException('Wrong file type'));
  }
};

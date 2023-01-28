import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class FileService {
  createFile(path, fileName, file) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
      writeFileSync(`${path}/${fileName}.${fileExtension}`, file.buffer);
    } catch (error) {
      console.log(error);
    }
  }
}

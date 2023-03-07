import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  formatFiles(files: Array<Express.Multer.File>) {
    return files.map((files) => files.filename);
  }
}

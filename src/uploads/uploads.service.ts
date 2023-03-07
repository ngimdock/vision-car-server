import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  uploadCarsImages(images: Array<Express.Multer.File>) {
    return images.map((image) => image.filename);
  }
}

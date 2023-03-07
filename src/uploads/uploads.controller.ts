import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CAR_IMAGES, MAX_CAR_IMAGES } from './constants';
import { UploadRoute } from './enums';
import { UploadsService } from './uploads.service';
import { carImageStorage, imagesTypesFilter } from './uploads.utils';

@Controller(UploadRoute.uploads)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post(UploadRoute.carImages)
  @UseInterceptors(
    FilesInterceptor(CAR_IMAGES, MAX_CAR_IMAGES, {
      // dest: 'car-img-uploaded',
      fileFilter: imagesTypesFilter,
      storage: carImageStorage,
    }),
  )
  uploadCarsImages(@UploadedFiles() carImages: Array<Express.Multer.File>) {
    return this.uploadsService.uploadCarsImages(carImages);
  }
}

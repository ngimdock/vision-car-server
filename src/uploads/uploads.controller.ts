import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CAR_IMAGES, MAX_CAR_IMAGES } from './constants';
import { UploadRoute } from './enums';
import { fileTypesFilter } from './uploads.utils';

@Controller(UploadRoute.uploads)
export class UploadsController {
  @Post(UploadRoute.carImages)
  @UseInterceptors(
    FilesInterceptor(CAR_IMAGES, MAX_CAR_IMAGES, {
      dest: 'car-img-uploaded',
      fileFilter: fileTypesFilter,
    }),
  )
  uploadCarsImages(@UploadedFiles() carImages: Array<Express.Multer.File>) {
    console.log({ carImages });
  }
}

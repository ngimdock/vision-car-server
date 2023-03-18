import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { UPLOADED } from './constants';
import { SwaggerUploadFilesDoc } from './decorators';
import { carDocumentsEnum, carImagesEnum, UploadRoute } from './enums';
import { UploadsService } from './uploads.service';
import { filesTypesFilter, getFilename } from './uploads.utils';

@ApiTags(UploadRoute.uploads)
@Controller(UploadRoute.uploads)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post(UploadRoute.carImages)
  @UseInterceptors(
    FilesInterceptor(carImagesEnum.uploadInputName, carImagesEnum.maxImages, {
      fileFilter: filesTypesFilter(carImagesEnum.extensions),
      storage: diskStorage({
        destination: `${UPLOADED}/${carImagesEnum.folder}`,
        filename: getFilename,
      }),
    }),
  )
  @SwaggerUploadFilesDoc()
  uploadCarsImages(@UploadedFiles() carImages: Array<Express.Multer.File>) {
    return this.uploadsService.formatFiles(carImages);
  }

  @Post(UploadRoute.carDocuments)
  @UseInterceptors(
    FilesInterceptor(
      carDocumentsEnum.uploadInputName,
      carDocumentsEnum.maxImages,
      {
        fileFilter: filesTypesFilter(carDocumentsEnum.extensions),
        storage: diskStorage({
          destination: `${UPLOADED}/${carDocumentsEnum.folder}`,
          filename: getFilename,
        }),
      },
    ),
  )
  @SwaggerUploadFilesDoc()
  uploadCarsDocumensts(
    @UploadedFiles() carDocuments: Array<Express.Multer.File>,
  ) {
    return this.uploadsService.formatFiles(carDocuments);
  }
}

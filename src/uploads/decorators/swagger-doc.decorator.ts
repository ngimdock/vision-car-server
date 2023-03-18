import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Express } from 'express';

export function SwaggerUploadFilesDoc() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Upload files with a multipart/form-data request',
      type: Array<Express.Multer.File>,
    }),
  );
}

export function SwaggerUploadFileDoc() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Upload file with a multipart/form-data request',
    }),
  );
}

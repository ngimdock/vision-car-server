import { diskStorage } from 'multer';
import { extname } from 'path';
import { getUUID } from 'src/common/helpers';
import { CustomRequest } from 'src/common/types';
import * as path from 'path';
import { AUTHOTIZED_IMAGES_TYPES } from './constants';
import { BadRequestException } from '@nestjs/common';

export const carImageStorage = diskStorage({
  destination: (req: CustomRequest, file, cb) => {
    const folderId = getUUID();

    console.log({ folderId });

    req.customData.carImagesId = folderId;

    console.log({ headers: req.headers, customData: req.customData });

    cb(null, folderId);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

export const fileTypesFilter = (req, file, callback) => {
  const imageExtension = path.extname(file.originalname);

  const errorMessage = getErrorImagesTypes(AUTHOTIZED_IMAGES_TYPES);

  if (!AUTHOTIZED_IMAGES_TYPES.includes(imageExtension)) {
    req.fileValidationError = errorMessage;
    return callback(new BadRequestException(errorMessage), false);
  }

  return callback(null, true);
};

const getErrorImagesTypes = (types: string[]) =>
  `Invalid file type provided, valid types are: ${JSON.stringify(types)}`;

import { diskStorage } from 'multer';
import { extname } from 'path';
import { getUUID } from 'src/common/helpers';
import { CustomRequest } from 'src/common/types';
import * as path from 'path';
import {
  AUTHOTIZED_IMAGES_TYPES,
  CAR_IMAGES_FOLDER,
  UPLOADED,
} from './constants';
import { BadRequestException } from '@nestjs/common';

export const carImageStorage = diskStorage({
  destination: (req: CustomRequest, file, cb) => {
    const carImagesSubFolder = getUUID();

    console.log({ carImagesSubFolder });

    // req.customData.carImagesId = carImagesSubFolder;

    // console.log({ headers: req.headers, customData: req.customData });

    cb(null, `${UPLOADED}/${CAR_IMAGES_FOLDER}`);
  },

  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const uniqueSuffix = getUUID();

    const filenameWithoutExtension = file.originalname.split('.')[0];

    const extension = extname(file.originalname);

    cb(null, `${filenameWithoutExtension}-${uniqueSuffix}${extension}`);
  },
});

export const imagesTypesFilter = (req, file, callback) => {
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

import { diskStorage } from 'multer';
import { extname } from 'path';
import { getUUID } from 'src/common/helpers';
import { CustomRequest } from 'src/common/types';
import * as path from 'path';
import { UPLOADED } from './constants';
import { BadRequestException } from '@nestjs/common';
import { carImagesEnum } from './enums';

export const getFilename = (req, file, cb) => {
  const uniqueSuffix = getUUID();

  const filenameWithoutExtension = file.originalname.split('.')[0];

  const extension = extname(file.originalname);

  cb(null, `${filenameWithoutExtension}-${uniqueSuffix}${extension}`);
};

export const filesTypesFilter = (validExtensions: any) =>
  function (req, file, callback) {
    const imageExtension = path.extname(file.originalname);

    const errorMessage = getErrorImagesTypes(validExtensions);

    if (!validExtensions.includes(imageExtension)) {
      req.fileValidationError = errorMessage;
      return callback(new BadRequestException(errorMessage), false);
    }

    return callback(null, true);
  };

const getErrorImagesTypes = (types: string[]) =>
  `Invalid file type provided, valid types are: ${JSON.stringify(types)}`;

export const storageDistination = diskStorage({
  destination: (req: CustomRequest, file, cb) => {
    const carImagesSubFolder = getUUID();

    console.log({ carImagesSubFolder });

    // req.customData.carImagesId = carImagesSubFolder;

    // console.log({ headers: req.headers, customData: req.customData });

    cb(null, `${UPLOADED}/${carImagesEnum.folder}`);
  },
});

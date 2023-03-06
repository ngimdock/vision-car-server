import { Request } from 'express';

export type CustomData = {
  carImagesId: string;
};

export type CustomRequest = Request & Record<'customData', CustomData>;

export const carImagesEnum = {
  uploadInputName: 'carImages',
  maxImages: 8,
  folder: 'car-images',
  maxSize: 2097152,
  extensions: ['.png', '.jpg', '.jpeg'],
} as const;

export const carDocumentsEnum = {
  uploadInputName: 'carDocuments',
  maxImages: 3,
  folder: 'car-documents',
  maxSize: 2097152,
  extensions: ['.pdf', '.doc', '.docx'],
} as const;

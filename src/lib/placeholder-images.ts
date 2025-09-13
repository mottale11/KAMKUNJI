import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  image_url: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

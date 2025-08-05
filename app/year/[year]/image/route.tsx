import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import YearImageResponse from
  '@/image-response/YearImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { getUniqueYears } from '@/photo/db/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';

export const dynamic = 'force-static';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'years',
  'image',
  getUniqueYears,
  years => years.map(({ year }) => ({ year })),
);

export async function GET(
  _: Request,
  context: { params: Promise<{ year: string }> },
) {
  const { year } = await context.params;

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      year: year,
    }),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return safePhotoImageResponse(
    photos,
    isNextImageReady => (
      <YearImageResponse {...{
        year,
        photos: isNextImageReady ? photos : [],
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts, headers },
  );
} 
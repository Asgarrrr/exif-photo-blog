'use client';

import { PATH_FULL_INFERRED } from '@/app/path';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';
import { SortBy } from './sort';

export default function PhotosLargeInfinite({
  initialOffset,
  itemsPerPage,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  excludePhotoIds,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy: SortBy
  sortWithPriority: boolean
  excludeFromFeeds?: boolean
  excludePhotoIds?: Set<string>
}) {
  // Create a unique cache key that includes the excluded photo IDs to prevent overlap
  const cacheKey = excludePhotoIds && excludePhotoIds.size > 0
    ? `page-${PATH_FULL_INFERRED}-exclude-${Array.from(excludePhotoIds).sort().join(',')}`
    : `page-${PATH_FULL_INFERRED}`;

  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds={excludeFromFeeds}
      wrapMoreButtonInGrid
    >
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosLarge
          photos={excludePhotoIds 
            ? photos.filter(photo => !excludePhotoIds.has(photo.id))
            : photos
          }
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
          keyPrefix="infinite-"
        />}
    </InfinitePhotoScroll>
  );
}

import {
  INFINITE_SCROLL_FULL_MULTIPLE,
  Photo,
} from '.';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';
import { SortBy } from './sort';

export default function PhotoFullPage({
  photos,
  photosCount,
  sortBy,
  sortWithPriority,
}:{
  photos: Photo[]
  photosCount: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  // Create a set of initial photo IDs to prevent duplicates in infinite scroll
  const initialPhotoIds = new Set(photos.map(photo => photo.id));

  return (
    <div className="space-y-1">
      <PhotosLarge {...{ photos }} />
      {photosCount > photos.length &&
        <div key="infinite-scroll">
          <PhotosLargeInfinite
            initialOffset={photos.length}
            itemsPerPage={INFINITE_SCROLL_FULL_MULTIPLE}
            sortBy={sortBy}
            sortWithPriority={sortWithPriority}
            excludeFromFeeds
            excludePhotoIds={initialPhotoIds}
          />
        </div>}
    </div>
  );
}

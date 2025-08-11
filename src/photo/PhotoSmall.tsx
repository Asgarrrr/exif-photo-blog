import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import { PhotoSetCategory } from '../category';
import ImageSmall from '@/components/image/ImageSmall';
import OptimizedLink from '@/components/OptimizedLink';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/app/path';
import { useRef } from 'react';
import useVisible from '@/utility/useVisible';

export default function PhotoSmall({
  photo,
  selected,
  className,
  prefetchStrategy = 'none',
  onVisible,
  ...categories
}: {
  photo: Photo
  selected?: boolean
  className?: string
  prefetchStrategy?: 'none' | 'hover' | 'viewport' | 'intent'
  onVisible?: () => void
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisible({ ref, onVisible });

  return (
    <OptimizedLink
      ref={ref}
      href={pathForPhoto({ photo, ...categories })}
      className={clsx(
        className,
        'active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
        'rounded-[3px] overflow-hidden',
        'border-main',
      )}
      prefetchStrategy={prefetchStrategy}
    >
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurDataURL={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        alt={altTextForPhoto(photo)}
      />
    </OptimizedLink>
  );
};

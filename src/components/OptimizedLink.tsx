'use client';

import Link, { LinkProps } from 'next/link';
import { useState, useRef, forwardRef } from 'react';
import { useRouter } from 'next/navigation';

interface OptimizedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  prefetchStrategy?: 'none' | 'hover' | 'viewport' | 'intent';
}

const OptimizedLink = forwardRef<HTMLAnchorElement, OptimizedLinkProps>(({
  children,
  prefetchStrategy = 'hover',
  prefetch = false,
  ...props
}, ref) => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const handlePrefetch = () => {
    if (isPrefetched || typeof props.href !== 'string') return;
    
    router.prefetch(props.href);
    setIsPrefetched(true);
  };

  const handleMouseEnter = () => {
    if (prefetchStrategy === 'hover') {
      hoverTimeoutRef.current = setTimeout(handlePrefetch, 100);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleTouchStart = () => {
    if (prefetchStrategy === 'intent') {
      handlePrefetch();
    }
  };

  return (
    <Link
      ref={ref}
      {...props}
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Link>
  );
});

OptimizedLink.displayName = 'OptimizedLink';

export default OptimizedLink;

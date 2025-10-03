import { forwardRef } from 'react';
import Image from 'next/image'; // ✅ import next/image
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-12 h-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            fill
            className="rounded-full object-cover"
            sizes="32px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
            {fallback ? (
              <span className="font-medium text-gray-600">
                {fallback.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <span className="font-medium text-gray-600">?</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;

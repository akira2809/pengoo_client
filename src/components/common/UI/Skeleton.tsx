import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type SkeletonVariant = 'default' | 'card' | 'text' | 'title' | 'avatar' | 'button' | 'image';
type SkeletonEffect = 'none' | 'pulse' | 'pulse-slow' | 'wave';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  effect?: SkeletonEffect;
  count?: number;
  wrapperClassName?: string;
}

const variantClasses: Record<SkeletonVariant, string> = {
  default: '',
  card: 'h-full w-full rounded-xl',
  text: 'h-4 w-full',
  title: 'h-6 w-3/4',
  avatar: 'h-10 w-10 rounded-full',
  button: 'h-10 w-24 rounded-md',
  image: 'aspect-square w-full',
};

const effectClasses: Record<Exclude<SkeletonEffect, 'wave'>, string> = {
  none: '',
  pulse: 'animate-pulse',
  'pulse-slow': 'animate-pulse [animation-duration:2s]',
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((
  { 
    variant = 'default',
    effect = 'pulse',
    className,
    count = 1,
    wrapperClassName,
    style,
    ...props 
  },
  ref
) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded-md';
  const variantClass = variantClasses[variant] || '';
  const effectClass = effect === 'wave' ? '' : effectClasses[effect as Exclude<SkeletonEffect, 'wave'>];
  
  const skeletonClasses = cn(
    baseClasses,
    variantClass,
    effectClass,
    className,
    {
      'animate-shimmer': effect === 'wave',
      'bg-[length:200%_100%]': effect === 'wave'
    }
  );

  const skeletonStyle = effect === 'wave' ? {
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    ...style
  } : style;

  if (count > 1) {
    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={skeletonClasses}
            style={skeletonStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={skeletonClasses}
      style={skeletonStyle}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export { Skeleton };

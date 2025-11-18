import { forwardRef, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge('rounded-sm border border-border bg-background shadow-sm', className)}
      {...props}
    />
  );
});

Card.displayName = 'Card';

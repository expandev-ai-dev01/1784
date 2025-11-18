import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-sm',
    'font-medium',
    'transition-colors',
    'focus-visible:outline-hidden',
    'focus-visible:ring-3',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary-600',
          'text-white',
          'hover:bg-primary-700',
          'focus-visible:ring-primary-600',
        ],
        outline: [
          'border',
          'border-border',
          'bg-transparent',
          'hover:bg-muted',
          'focus-visible:ring-primary-600',
        ],
        ghost: ['hover:bg-muted', 'focus-visible:ring-primary-600'],
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

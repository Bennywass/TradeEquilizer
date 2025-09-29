import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow-md': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md': variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 shadow-sm hover:shadow-md': variant === 'outline',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          'touch-target',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
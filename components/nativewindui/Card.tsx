import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View, ViewProps } from 'react-native';

import { cn } from '../../lib/cn';

const cardVariants = cva(
  'bg-card border border-border rounded-lg shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-card',
        secondary: 'bg-secondary/10',
        outline: 'border-border',
        ghost: 'border-0 shadow-none',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<View, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('flex flex-row items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };


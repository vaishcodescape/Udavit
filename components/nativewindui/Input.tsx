import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { TextInput, TextInputProps, View, ViewProps } from 'react-native';

import { cn } from '../../lib/cn';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive',
        success: 'border-green-500',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 py-1',
        lg: 'h-12 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps extends TextInputProps, VariantProps<typeof inputVariants> {
  containerProps?: ViewProps;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, variant, size, containerProps, label, error, ...props }, ref) => {
    return (
      <View className="space-y-2" {...containerProps}>
        {label && (
          <View className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </View>
        )}
        <TextInput
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, size }),
            'text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          placeholderTextColor="#6b7280"
          {...props}
        />
        {error && (
          <View className="text-sm text-destructive">{error}</View>
        )}
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };

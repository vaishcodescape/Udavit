import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'largeTitle' | 'footnote' | 'caption2';
  children: React.ReactNode;
}

export const Text: React.FC<CustomTextProps> = ({ 
  variant, 
  children, 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    largeTitle: 'text-3xl font-bold',
    footnote: 'text-sm text-gray-600',
    caption2: 'text-xs text-gray-500'
  };

  const baseClasses = variantClasses[variant] || 'text-base';
  
  return (
    <RNText className={`${baseClasses} ${className}`} {...props}>
      {children}
    </RNText>
  );
};

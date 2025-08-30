import React from 'react';
import { Text, TextProps } from 'react-native';

interface IconProps extends TextProps {
  name: string;
  size: number;
  color: string;
  ios?: any;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size, 
  color, 
  ios,
  ...props 
}) => {
  // Simple icon mapping using emoji as fallback
  const iconMap: Record<string, string> = {
    'account-circle-outline': '👤',
    'message-processing': '💬',
    'chart-timeline-variant': '📊',
    'account-multiple': '👥'
  };

  const icon = iconMap[name] || '🔘';

  return (
    <Text 
      style={{ 
        fontSize: size, 
        color: color,
        textAlign: 'center'
      }}
      {...props}
    >
      {icon}
    </Text>
  );
};

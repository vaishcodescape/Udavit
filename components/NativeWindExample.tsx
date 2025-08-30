import { styled } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function NativeWindExample() {
  return (
    <StyledView className="p-6 bg-white dark:bg-gray-900">
      <StyledText className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        NativeWind Example
      </StyledText>
      
      <StyledText className="text-gray-600 dark:text-gray-300 mb-6">
        This component demonstrates NativeWind utility classes for styling React Native components.
      </StyledText>
      
      <StyledView className="space-y-4">
        <StyledTouchableOpacity className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg">
          <StyledText className="text-white font-semibold text-center">Primary Button</StyledText>
        </StyledTouchableOpacity>
        
        <StyledTouchableOpacity className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-6 py-3 rounded-lg">
          <StyledText className="text-gray-800 font-semibold text-center">Secondary Button</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      
      <StyledView className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <StyledText className="text-sm text-gray-700 dark:text-gray-300">
          Features: Responsive design, dark mode support, hover states, and utility-first CSS classes.
        </StyledText>
      </StyledView>
    </StyledView>
  );
}

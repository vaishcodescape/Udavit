import { ScrollView, View } from 'react-native';
import { NativeWindExample } from '../../components/NativeWindExample';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function TabOneScreen() {
  return (
    <ScrollView className="flex-1">
      <ThemedView className="flex-1 items-center justify-center p-6">
        <ThemedText className="text-2xl font-bold mb-4">Welcome to NativeWind!</ThemedText>
        <ThemedText className="text-center mb-8">Your app now uses Tailwind CSS classes for styling.</ThemedText>
        
        <NativeWindExample />
        
        <View className="my-8 h-px w-full bg-gray-200 dark:bg-gray-700" />
        
        <ThemedText className="text-lg font-semibold mb-2">Benefits:</ThemedText>
        <ThemedText className="text-center text-gray-600 dark:text-gray-400">
          • Utility-first CSS classes{'\n'}
          • Dark mode support{'\n'}
          • Responsive design{'\n'}
          • Consistent spacing & colors
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
} 

import { View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText className="text-xl font-bold">Tab Two</ThemedText>
      <View className="my-8 h-px w-4/5" />
      <ThemedText>This is the second tab.</ThemedText>
    </ThemedView>
  );
} 

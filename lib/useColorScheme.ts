import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
  const scheme = useNativeColorScheme() ?? 'light';
  return { colorScheme: scheme };
}

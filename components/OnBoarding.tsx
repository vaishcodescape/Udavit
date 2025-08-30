import { SafeAreaView, Text, View } from 'react-native';

export default function OnBoarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#047857' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ 
          fontSize: 32, 
          color: '#FFFFFF', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          OnBoarding Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}

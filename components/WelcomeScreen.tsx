import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* App Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to Udavit</Text>
        <Text style={styles.subtitle}>Your AI-Powered Assistant</Text>
      </View>
      
      {/* Additional welcome content can go here */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>
          Get ready to experience the future of productivity
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark theme background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4,
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from 'expo-router';
const StartPage = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Find the Perfect Room, Hotel</Text>
        <Text style={styles.subtitle}>
          We've helped millions across the nation find their perfect match... and you're next!
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreText} onPress={() => navigation.navigate('signupP')}>become a partner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreText} onPress={() => navigation.navigate('signup')}>signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('login')}>
          <Text style={styles.loginText} >Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        {/* <Image
          source={require('./assets/mockIllustration.png')} 
          style={styles.illustration}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F3FF', // Light blue background
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  exploreButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  exploreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default StartPage;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from 'expo-router';

const StartPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>WELCOME TO HELP BOOKING</Text>

      <Image 
        source={require('../assets/images/icons.png')} 
        style={styles.image}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('signup')}>
        <Text style={styles.buttonText}>LOOKING FOR ROOM</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('signup')}>
        <Text style={styles.buttonText}>SIGN UP TO BECOME PARTNER</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('login')}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5ce1e6',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20, // Add some horizontal padding to prevent buttons from touching the edges
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
  },
  button: {
    marginTop: 20, // Reduced margin to fit all buttons
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%', // Make the buttons span the full width with some padding
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18, // Adjusted font size for better fit
  },
  image: {
    width: 300, // Reduced image size to make space for the buttons
    height: 300,
    marginTop: 30,
    borderRadius: 20,
  },
});

export default StartPage;

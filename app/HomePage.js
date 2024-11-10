// StartPage.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform , Image } from 'react-native';
import { useNavigation } from 'expo-router';
import axios from 'axios';


const StartPage = () => {
const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <Text style={styles.header}>WELCOME TO HELP BOOKING</Text>

      <Image 
        source={require('../assets/images/icons.png')} 
        style={styles.image}
      />
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('list')}>
        <Text style={styles.buttonText}>Go to List</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ip')}>
        <Text style={styles.buttonText}>Go to Insert</Text>
      </TouchableOpacity> */}
      
       <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate('signup')}>
        <Text style = {styles.buttonText}>GET STARTED
        </Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => {navigation.navigate('login')}}>
                   <Text style={styles.loginText}>or you already have an account</Text>
                </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5ce1e6',
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white'
  },
  button: {
    marginTop: 50,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
  
    color: 'black',
    fontSize: 20,
  },
  image: {
    width: 400, // Set your desired width
    height: 400, // Set your desired height
    marginTop: 50,
    borderRadius:20,

  },
  loginText: {
    color: '#6200ee', // Make the text appear as a link
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: 'underline',
},
});

export default StartPage;

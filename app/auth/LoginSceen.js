
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';

var baseUrl = "http://localhost:5000";

if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
}
if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}
const LoginScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const TestLogin = async () => {
        if (!username || !password) {
          setError('Please enter both username and password');
          return;
        }
        setLoading(true); 
    
        const data = {
          uname: username,
          password: password
        };
        try {
          const res = await axios.post(`${baseUrl}/api/login`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
         const arr = [username, res.data];
          console.log('urole ='+res.data.urole)
          if (res.data.urole === 0 ) {
            navigation.navigate('admin', {
              username: arr
              }
            );
          } else {
            navigation.navigate('home', {
              username: arr
              }
            );
          }
        } catch (err) {
          setError('Error logging in. Please try again.');
          console.error('Login Error:', err);
        } finally {
          setLoading(false); 
        }
      };
  return (
    <View style={styles.container}>
      
      <View style={styles.illustrationContainer}>
     
        {/* <Image 
          source={require('../assets/images/icons.png')} 
          style={styles.illustration} 
        /> */}
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
        <TouchableOpacity style={styles.button} onPress={TestLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Forgot password? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Get new</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do you have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Create new</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      },
      illustrationContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      illustration: {
        width: 300,
        height: 350,
        resizeMode: 'contain',
       
      },
      formContainer: {
        
        flex: 1,
        bottom:100,
        width: '90%',
        alignItems: 'center',
      },
      title: {
        right:'40%',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
      },
      button: {
        width: '100%',
        height: 50,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20, // Increased spacing between button and footer
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10, // Added margin to ensure proper spacing
      },
      footerText: {
        fontSize: 14,
        color: '#666',
      },
      footerLink: {
        fontSize: 14,
        color: '#007BFF', // Blue link for better visibility
        fontWeight: 'bold',
      },
});

export default LoginScreen;

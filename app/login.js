import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, Image, ActivityIndicator } from "react-native";
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

export default function UserLogin() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors

  const TestLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true); // Start loading state

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

     // Log the response to check
     const arr = [username, res.data];
      
      if (!res.data.uid ===0 ) {
        navigation.navigate('home', {
          username: arr
          }
        );
        
      
      } else {
        navigation.navigate('admin', {
          username: arr
          }
        );
      }

    } catch (err) {
      setError('Error logging in. Please try again.');
      console.error('Login Error:', err);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <View style={styles.login_container}>
      <LdImg />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={TestLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const LdImg = () => {
  return (
    <View>
      <Image
        source={require('../assets/images/icons.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  login_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#DB4437',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 100,
    marginBottom: 20, // Margin for spacing between image and inputs
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  }
});

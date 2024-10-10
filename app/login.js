import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';

export default function UserLogin() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const TestLogin = async () => {
        try {
            
            const res = await axios.get(`http://10.0.2.2:5000/login/${username}`);
            
            if (res.data && res.data.password === password) {
               
                navigation.navigate('home');
            } else {
                console.log("Response Data:", res.data);  
                alert('Invalid username or password');
            }
        } catch (error) {
            console.log("Error response data:", error.response?.data);
            console.log("Error response status:", error.response?.status);
            console.log("Error response headers:", error.response?.headers);
            alert('An error occurred during login');
        }
    };

    return (
        <View style={styles.login_container}>
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
                <TouchableOpacity style={styles.button} onPress={TestLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
});

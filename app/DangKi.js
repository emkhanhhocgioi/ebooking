import { StyleSheet, Image, Text, View, TouchableOpacity, TextInput, Platform } from "react-native";
import axios from "axios";
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';

var baseUrl = "http://localhost:5000";

if (Platform.OS === "android") {
    baseUrl = "http://10.0.2.2:5000";
}
if (Platform.OS === "ios") {
    baseUrl = "http://172.20.10.9:5000";
}

export default function DangKi() {
    const navigation = useNavigation();
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState(''); // Added state for Confirm Password
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async () => {
        if (!Username || !Email || !Password || !ConfirmPassword) {
            alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
            return;
        }

        if (Password !== ConfirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }

        setLoading(true); // Start loading

        const data = {
            uname: Username,
            email: Email,
            password: Password
        };
        console.log(`${baseUrl}/api/signup`)
        console.log(data)
        try {
            const res = await axios.post(`${baseUrl}/api/signup`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            setLoading(false); // Stop loading
            
            if (res.status === 201) {
                alert("Tạo tài khoản thành công");
                navigation.navigate('home',{username:Username});
            } else {
                alert("Đã xảy ra lỗi khi tạo tài khoản");
            }
        } catch (error) {
            console.log(error.response ? error.response.data : error.message);
            setLoading(false); // Stop loading in case of error
            alert("Không thể kết nối với máy chủ");
        }
    };

    return (
        <View style={styles.container}>
            <LdImg />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={Username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={Email}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={Password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={ConfirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>
                        {loading ? "Loading..." : "Sign Up with Booker"}
                    </Text>
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
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center", // Center the content vertically
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 100,
        marginBottom: 20, // Margin for spacing between image and inputs
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 20, // Space from the icon
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 20, // Space above and below the buttons
    },
    button: {
        backgroundColor: '#ffffff', // Button background color
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10, // Space between buttons
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },

    signupText: {
        marginTop: 15,
    },
});

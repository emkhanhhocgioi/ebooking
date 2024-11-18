
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
const SignUpScreenPartner = () => {
    const navigation = useNavigation();
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [phonenumber,setPhonenumber] = useState('')
    const [loading, setLoading] = useState(false); 

    const handleSubmit = async () => {
        if (!Username || !Email || !Password || !ConfirmPassword) {
            alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
            return;
        }
        if (Password !== ConfirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }

        setLoading(true); 
    
        const data = {
            uname: Username,
            email: Email,
            password: Password,
            PhoneNumber: phonenumber,
        };
    
        console.log(data);
    
        try {
            const res = await axios.post(`${baseUrl}/api/signupPartner`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (res.status >= 200 && res.status < 300) {
                alert("Tạo tài khoản thành công");
                navigation.navigate('login');
            } else {
                alert("Đã xảy ra lỗi khi tạo tài khoản");
            }
        } catch (error) {
            console.log(error.response ? error.response.data : error.message);
    
       
            setLoading(false);
    
     
            if (error.response) {
                alert(error.response.data.message || "Không thể kết nối với máy chủ");
            } else if (error.request) {
                alert("Không nhận được phản hồi từ máy chủ");
            } else {
                alert("Đã xảy ra lỗi khi thực hiện yêu cầu");
            }
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
        <Text style={styles.title}>Sign up as a partner</Text>
        
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
                placeholder="Phone number"
                value={phonenumber}
                onChangeText={setPhonenumber}
              
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>signup</Text>
        </TouchableOpacity>
        

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do you have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Login</Text>
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
        bottom:300,
        width: '90%',
        alignItems: 'center',
      },
      title: {
        right:'20%',
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
        marginBottom: 20, 
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
        marginVertical: 10, 
      },
      footerText: {
        fontSize: 14,
        color: '#666',
      },
      footerLink: {
        fontSize: 14,
        color: '#007BFF', 
        fontWeight: 'bold',
      },
});

export default SignUpScreenPartner;

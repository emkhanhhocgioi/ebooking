import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Platform, StyleSheet, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from 'expo-router';
var baseUrl = "http://localhost:5000";

if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
}
if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationinput,setVerificationInput] = useState('') 
  const [modalVisible, setModalVisible] = useState(false); 
  const [newpasswordvis,setNewpassowrdvis] = useState(false);
  const [newpassword,setnewpassword] = useState('');
  const [confirmpassword,setConfirmpassword] = useState('');
  const [btntype,setBtntype] = useState(0);
  // Hàm tạo mã ngẫu nhiên
  const randomCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  };


  const handleForgotPassword = () => {
    if (email === '') {
      Alert.alert('Error', 'Vui lòng nhập email của bạn');
      return;
    }
    let code = randomCode();
    setVerificationCode(code);
    const data = {
      email: email,
      code: code,
    };

    
    axios.post(`${baseUrl}/api/send-verificationcode`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      setModalVisible(true); 
      Alert.alert('Success', 'Link đặt lại mật khẩu đã được gửi đến email của bạn!');
    }).catch((error) => {
      console.log(error)
      Alert.alert('Error', 'Không thể gửi mã xác thực');
    });
  };


  const handleVerifyCode = async () => {
    if ( verificationinput == verificationCode) {
        setBtntype(1);
        setNewpassowrdvis(true)
    } else {
      Alert.alert('Error', 'Vui lòng nhập mã xác thực');
    }
  };

  const handleChangepassword = async () =>{
    if(newpassword === confirmpassword){
        const data ={
          email:email,
          newpassword:newpassword,
        };
        try {
          const res = axios.post(`${baseUrl}/api/chagnepassword`,data, {
              headers: {
                'Content-Type': 'application/json',
              },
            }) 
            
            Alert.alert('The password has been updated!')
            navigation.navigate('login')
        } catch (error) {
          console.log(error)
        }
  
        setModalVisible(false); 
      }  
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Gửi Yêu Cầu</Text>
      </TouchableOpacity>

      {/* Modal cho mã xác thực */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Nhập Mã Xác Thực</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã xác thực"
              value={verificationinput}
              onChangeText={setVerificationInput}
            
            />
          {newpasswordvis === true ? (
  
                <>
                    <TextInput
                    style={styles.input}
                    placeholder="New password"
                    value={newpassword}
                    onChangeText={setnewpassword}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    value={confirmpassword}
                    onChangeText={setConfirmpassword}
                    />
                </>
                    ) : (
                  
                    null 
                    )}
        {btntype === 0 ? (
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleChangepassword}>
                <Text style={styles.buttonText}>Change password</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
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
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const SubscriptionScreen = () => {
  const route = useRoute();
  const uid = route.params.uid;
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedPrice, setSelectedPrice] = useState('20.00'); // Default price
  const [selectedPayment, setSelectedPayment] = useState('Credit Card');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentUri, setPaymentUri] = useState('');

  const handleSubmit = async () => {
    const data = {
      plan: selectedPlan,
      price: selectedPrice,
    };

    try {
      const res = await axios.post(`${baseUrl}/api/create-payment`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.status === 200) {
        setPaymentUri(res.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe Now</Text>

      {/* Plan Picker */}
      <Text style={styles.label}>Select Plan:</Text>
      <Picker
        selectedValue={selectedPlan}
        onValueChange={(itemValue) => setSelectedPlan(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Basic Plan" value="basic" />
        <Picker.Item label="Standard Plan" value="standard" />
        <Picker.Item label="Premium Plan" value="premium" />
      </Picker>

      {/* Duration Picker */}
      <Text style={styles.label}>Select Duration:</Text>
      <Picker
        selectedValue={selectedPrice}
        onValueChange={(itemValue) => setSelectedPrice(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="1 month/20.00 USD" value='20.00' />
        <Picker.Item label="3 months/50.00 USD" value='50.00' />
        <Picker.Item label="6 months/100.00 USD" value='100.00' />
        <Picker.Item label="1 year/180.00 USD" value='180.00' />
      </Picker>

      {/* Payment Picker */}
      <Text style={styles.label}>Select Payment Method:</Text>
      {/* Removed the commented-out Picker for now, as it's not in use */}

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Subscribe</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="#000" />
          </TouchableOpacity>
          <WebView
            source={{ uri: paymentUri }}
            style={{ flex: 1 }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
  },
});

export default SubscriptionScreen;

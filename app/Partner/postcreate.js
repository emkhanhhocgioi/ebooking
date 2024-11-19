import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';  // Import from @react-native-picker/picker

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const HotelInputForm = () => {
  const route = useRoute();
  const uid = route.params.uid;
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [destination, setDestination] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [addon, setAddon] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const getDestinationData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/getDestination`);
      if (response.data) {
        
        setDestination(response.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching data');
    }
  };
  
  const randomHotelid = () => {
    return 'hotel_' + Math.random().toString(36).substr(2, 9); 
    }

  const createNewPost = async () => {
    const postID = randomHotelid();
    const UID = uid;
    console.log(UID);

    const formData = new FormData();
    try {
      let images = [...selectedImages];
      if (images.length < 4) {
        while (images.length < 4) {
          images.push({ uri: '', fileName: 'placeholder.jpg', mimeType: 'image/jpeg' });
        }
      }

      formData.append('PostID', postID);
      formData.append('posterID', UID);
      formData.append('hotelname', hotelName);
      formData.append('Address', address);
      formData.append('Price', price);
      formData.append('city', city);
      formData.append('country', country);
      formData.append('describe', description);
      formData.append('Addon', addon);

      images.forEach(image => {
        formData.append('file', {
          uri: image.uri,
          name: image.fileName || 'upload.jpg',
          type: image.mimeType || 'image/jpeg',
        });
      });

      console.log('Selected images:', selectedImages);

      const res = await axios.post(`${baseUrl}/api/createpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        Alert.alert("Post created successfully");
        setHotelName('')
        setAddress('')
        setCity('')
        setPrice('')
        setCountry('')
        setDescription('')
        setAddon('')
        setSelectedImages([])
      } else {
        console.log('Error creating post', res.status);
      }
    } catch (error) {
      console.error('Error uploading:', error.message);

      if (error.response) {
        console.log('Server responded with:', error.response.data.message || error.response.statusText);
      } else if (error.request) {
        console.log('No response received:', error.request);
      } else {
        console.log('Error in setup:', error.message);
      }
    }
  };

  const pickImageAsyncMutilple = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let images = [...selectedImages];
      while (images.length < 4) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled) {
          images.push(result.assets[0]);
          setSelectedImages(images);
        } else {
          break;
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not pick images.');
    }
  };

  useEffect(() => {
    getDestinationData();
  }, []);
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        setCountries(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Hotel Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter hotel name"
        value={hotelName}
        onChangeText={setHotelName}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      {countries && countries.length > 0 ? (
        <Picker
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
          style={styles.picker}
        >
          {countries.map((ctry, index) => (
            <Picker.Item
              key={index}
              label={ctry.name.common} 
              value={ctry.name.common} 
            />
          ))}
        </Picker>
      ) : null}

      {destination && destination.length > 0 ? (
        <Picker
          selectedValue={city}
          onValueChange={(value) => setCity(value)}
          style={styles.picker}
        >
          {destination.map((dest, index) => (
            <Picker.Item
              key={index}
              label={dest.destname}
              value={dest.destname}
            />
          ))}
        </Picker>
      ) : null}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Add-on</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter add-on details"
        value={addon}
        onChangeText={setAddon}
      />

      <TouchableOpacity style={styles.addButton} onPress={pickImageAsyncMutilple}>
        <Ionicons name="image-outline" size={24} color="black" />
        <Text style={styles.addButtonText}>Add Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={createNewPost}>
        <Ionicons name="save-outline" size={24} color="black" />
        <Text style={styles.addButtonText}>Create new room</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 15,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'wheat',
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  addButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HotelInputForm;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Platform,Alert, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
const UpdatePost = ({data}) => {
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [addon, setAddon] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [destination, setDestination] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const postid = data.PostID;
  let baseUrl = "http://localhost:5000";
  if (Platform.OS === "android") {
    baseUrl = "http://10.0.2.2:5000";
  } else if (Platform.OS === "ios") {
    baseUrl = "http://172.20.10.9:5000";
  }
  
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
  const deleteExistPostImg = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/delete/postexistimg`, {
        postid: postid, 
      });
  
    
      console.log('Image deleted successfully:', response.data);
  
    } catch (error) {
 
      console.error('Error deleting image:', error);
    }
  };
  const createNewPost = async () => {
   
  
 
    const missingFields = [];
    if (!postid) missingFields.push('PostID');
    if (!hotelName) missingFields.push('HotelName');
    if (!address) missingFields.push('Address');
    if (!price) missingFields.push('price');
    if (!city) missingFields.push('city');
    if (!country) missingFields.push('country');
    if (!description) missingFields.push('describe');
    if (!addon) missingFields.push('addon');
  
  
    if (missingFields.length > 0) {
      Alert.alert(`Missing required data: ${missingFields.join(', ')}`);
      return; 
    }
    await deleteExistPostImg();
    const formdata = new FormData();
    let images = [...selectedImages];
  
   
    if (images.length < 4) {
      while (images.length < 4) {
        images.push({ uri: '', fileName: 'placeholder.jpg', mimeType: 'image/jpeg' });
      }
    }
  
    
    formdata.append('PostID', postid);
    formdata.append('HotelName', hotelName);
    formdata.append('Address', address);
    formdata.append('price', price);
    formdata.append('city', city);
    formdata.append('country', country);
    formdata.append('describe', description);
    formdata.append('addon', addon);
  

    images.forEach((image, index) => {
      formdata.append('file', {
        uri: image.uri,
        name: image.fileName || `image${index}.jpg`,
        type: image.mimeType || 'image/jpeg',
      });
    });
  
    try {
      const res = await axios.post(`${baseUrl}/api/updatepost`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', res.status);
      Alert.alert('Update hotel Successful')
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  useEffect(()=>{
    console.log(data)
  
  },[data])
  useEffect(()=>{
   getDestinationData()
  
  },[])
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Hotel Name</Text>
      <TextInput
        style={styles.input}
        placeholder={data.PostID}
        value={hotelName}
        onChangeText={setHotelName}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder={data.Address}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new price"
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
        placeholder={data.describe}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Add-on</Text>
      <TextInput
        style={styles.input}
        placeholder={data.addon}
        value={addon}
        onChangeText={setAddon}
      />

      <View style={styles.imageRow}>
        {data.images.map((image,index) => (
          <Image
            key={index}
            source={{ uri:  `${baseUrl}`+image  }}
            style={styles.image}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={pickImageAsyncMutilple}>
        <Ionicons name="image-outline" size={24} color="black" />
        <Text style={styles.addButtonText}>Add Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={createNewPost}>
        <Ionicons name="save-outline" size={24} color="black" />
        <Text style={styles.addButtonText}>Update Room</Text>
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
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
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

export default UpdatePost;

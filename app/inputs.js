import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const Inputs = () => {
   
    const [componentName, setComponentName] = useState('');
    const [componentType, setComponentType] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const pickImageAsync = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                quality: 1,
            });
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Could not pick an image.');
        }
    };

    const createFormData = (uri) => {
        const fileName = uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        const formData = new FormData();

        formData.append('image', {
            name: fileName,
            uri,
            type: `image/${fileType}`,
        });

        formData.append('componentName', componentName);
        formData.append('componentType', componentType);
     

        return formData;
    };

    const insertHardware = async () => {
        if (!selectedImage) {
            Alert.alert('Error', 'Please select an image.');
            return;
        }

        const formData = createFormData(selectedImage);

        try {
            const response = await axios.post(
                'http://10.0.2.2:5000/inputs',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            Alert.alert('Success', response.data.message || 'Hardware inserted successfully.');
        } catch (error) {
            console.error('Error inserting hardware:', error);
            Alert.alert('Error', 'Failed to insert hardware. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nhập Linh Kiện</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Component Name"
                value={componentName}
                onChangeText={setComponentName}
            />
            <TextInput
                style={styles.input}
                placeholder="Component Type"
                value={componentType}
                onChangeText={setComponentType}
            />
            
            <TouchableOpacity style={styles.btn} onPress={pickImageAsync}>
                <Text style={styles.btnText}>Pick an Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={insertHardware}>
                <Text style={styles.btnText}>Insert Hardware</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    btn: {
        marginBottom: 10,
        width: '80%',
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#6200ee', 
        borderRadius: 5, 
    },
    btnText: {
        color: 'white', 
        fontSize: 16, 
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center', // Center the header
      }
});

export default Inputs;
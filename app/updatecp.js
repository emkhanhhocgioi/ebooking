import React, { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

var baseUrl = "http://localhost:5000"

if(Platform.OS ==="android"){
 baseUrl = "http://10.0.2.2:5000"
}
if(Platform.OS ==="ios"){
    baseUrl = "http://172.20.10.9:5000"
   }

const Updatecpn = () => {
    const route = useRoute();
    const { componentID } = route.params; 
    const [componentName, setComponentName] = useState('');
    const [componentType, setComponentType] = useState('');
    const [componentPrice,setComponentPrice] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [originalData, setOriginalData] = useState({ name: '', type: '', image: null });

    
    const fetchingItem = async () => {
        try {
            const res = await axios.get(`${baseUrl}/getdata/${componentID}`);
            const data = res.data;
    
            setComponentName(data.componentName || '');
            setComponentType(data.componentType || '');
            setComponentPrice(data.componentPrice || '');
    
            if (data.images && data.images.length > 0) {
                const imageUri = `data:image/${data.images[0].contentType};base64,${data.images[0].data}`;
                setSelectedImage(imageUri);
            }
    
           
            setOriginalData({ 
                name: data.componentName, 
                type: data.componentType, 
                price: data.componentPrice, 
                image: data.images && data.images.length > 0 ? `data:image/${data.images[0].contentType};base64,${data.images[0].data}` : null 
            });
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message || "Failed to fetch component data.");
        }
    };

    const pickImageAsync = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/updateuser`, {
                username: uname,  
                email: newEmail,  
                desc: newDesc,   
            });
    
          
            if (response.status === 200) {
                alert('Profile updated successfully');
                
               
                setModalVisible(false);
    
                
                const updatedUser = response.data.user; 
                setEmail(updatedUser.Email);  
                setFollowing(updatedUser.followingcount || 0);  
                setFollower(updatedUser.followercount || 0);    
                setImgPrf(updatedUser.imgProfile || '');      
    
              
            }
        } catch (error) {
            console.log('Error updating data:', error.response || error);
            alert('Failed to update profile');
        }
    };
    
    useEffect(() => {
        fetchingItem();
    }, []);

    const createFormData = (uri) => {
        const fileName = uri ? uri.split('/').pop() : ''; // Handle no image scenario
        const fileType = uri ? fileName.split('.').pop() : ''; // Handle no image scenario
        const formData = new FormData();

        if (uri) {
            formData.append('image', {
                name: fileName,
                uri,
                type: `image/${fileType}`,
            });
        }

        formData.append('componentName', componentName);
        formData.append('componentType', componentType);
        formData.append('componentPrice', componentPrice);
        return formData;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Update Component</Text>
            
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
            <TextInput
                style={styles.input}
                placeholder="Component Price"
                value={componentPrice} 
                onChangeText={setComponentPrice}
            />

            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }} 
                    style={styles.image}
                />
            )}

            <TouchableOpacity style={styles.btn} onPress={pickImageAsync}>
                <Text style={styles.btnText}>Pick an Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleChange}>
                <Text style={styles.btnText}>Save Changes</Text>
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
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});

export default Updatecpn;

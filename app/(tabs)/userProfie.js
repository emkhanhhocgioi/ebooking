import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,Alert,FlatList,ScrollView,Switch, StyleSheet, Platform, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import HotelDetailScreen from '../hotelDetail';
import axios from 'axios';




let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const ProfileScreen = () => {
  const route = useRoute();
  const uname = route.params?.username;
  const navigation = useNavigation();
  //for profile update
  const [email, setEmail] = useState('');
  const [desc, setDesc] = useState('');
  const [following, setFollowing] = useState('');
  const [follower, setFollower] = useState('');
  const [urole, setUrole] = useState('');
  const [file, setfile] = useState(null);
  const [imgProf,setImageProfie]=useState(null);
  //for profile update
  const [isModalVisible, setModalVisible] = useState(false); 
  const [isModalVisible2, setModalVisible2] = useState(false); 
  const [newEmail, setNewEmail] = useState('');
  const [newDesc, setNewDesc] = useState('');
   
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //for post create
  const [postID,setPostID] = useState('')
  const [userID,setUID] = useState('')
  //for mutilple file
  const [selectedImages, setSelectedImages] = useState([]);
  const random  = () =>{
    const randomId =  'user'+'_'+Math.random(100000)
    return randomId ;
  }
  //for post
  const [PostImg,setPostImg] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [postData,setPostData] = useState([]);
  const [hotelData,setHotelData] = useState(null)
  const [isModalVisible3, setModalVisible3] = useState(false); 
  const [postDetails, setPostDetails] = useState({
  
  hotelname: '',
  Address: '',
  Price: '',
  city: '',
  country: '',
  describe: '',
  Addon: '',
 
});


  
const createNewPost = async () => {
  const postID = random();
  const UID = userID;
  console.log(UID)
 // Assuming 'uname' is defined elsewhere
  const { hotelname, Address, Price, city, country, describe, Addon,} = postDetails;

  // Utility function to validate parameters
  function validateParams(params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        throw new Error(`Parameter ${key} must be provided`);
      }
    }
  }

  const formData = new FormData();

  try {
    
    validateParams({
      postID,
      UID,
      hotelname,
      Address,
      Price,
      city,
      country,
      describe,
      Addon,
     
      selectedImages
    });

    
    let images = [...selectedImages];
    if (images.length < 4) {
    
      while (images.length < 4) {
        images.push({ uri: '', fileName: 'placeholder.jpg', mimeType: 'image/jpeg' });
      }
    }


    

 
    formData.append('PostID', postID);
    formData.append('posterID', UID);
    formData.append('hotelname', hotelname);
    formData.append('Address', Address);
    formData.append('Price', Price);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('describe', describe);
    formData.append('Addon', Addon);
  
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
      console.log('Post created successfully');
      Alert.alert("Post created successfully");
      setPostDetails({
        hotelname: '',
        Address: '',
        Price: '',
        city: '',
        country: '',
        describe: '',
        Addon: '',
        
      });
      setSelectedImages([]);
      setModalVisible2(false); 
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


  const getUser = async (uname) => {
    if (!uname) {
      console.log('Username is missing');
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/api/getUserData`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          username: uname,
        },
      });
      const data = response.data;
      setUID(data.ObjecID||'')
      setDesc(data.Desc || '');
      setEmail(data.Email || '');
      setFollower(data.followercount || 0);
      setFollowing(data.followingcount || 0);
      setUrole(data.urole || '');
      setImageProfie(data.imgProfile || '');
      setImageUri(`${baseUrl}/api/image?imgname=${imgProf}`)
      console.log(data.ObjecID)
      console.log(imgProf)

    } catch (error) {
      console.error('Error uploading:', error);
    if (error.response) {
      console.log('Server responded with:', error.response.message);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error in setup:', error.message);
    }
    }
  };
  const getUserProfileImage= async(imgProf)=>{
    try {
      const response = await axios.get(`${baseUrl}/api/image?imgname=${imgProf}`);
      
      if (response.data.success) {
        setImageUri(`${baseUrl}/api/image?imgname=${imgProf}`); 
       
      } else {
        setError('No image found');
      }
    } catch (err) {
      setError('Error fetching image');
    } finally {
      setLoading(false);
    }

  }
  useEffect(() => {
    if (uname) {
      getUser(uname);
      getUserPost(userID);
    }
    
  
   
  }, [uname,imgProf]);

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
        setfile(result.assets[0]);
        console.log(result.assets[0]);  
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not pick an image.');
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
      while (images.length < 4) { // Limit to 4 images
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled) {
          images.push(result.assets[0]); // Save each image URI
          setSelectedImages(images); // Update state
        } else {
          break; // Exit if user cancels
        }
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not pick images.');
    }
  };

const handleSaveChanges = async () => {
  const formData = new FormData();
  
  // Append the file if present
  if (file) {
    formData.append('file', {
      uri: file.uri,
      name: uname+'_'+file.fileName || 'upload.jpg', 
      type: file.mimeType || 'image/jpeg',  
    });
  }

 
  formData.append('username', uname);
  formData.append('email', newEmail);
  formData.append('desc', newDesc);

  try {
      const response = await axios.post(`${baseUrl}/api/upload/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         
      });

      if (response.status === 200) {
          Alert.alert('Profile updated successfully');
          setModalVisible(false);
          getUser(uname);
      }
  } catch (error) {
    console.error('Error uploading:', error);
    if (error.response) {
      console.log('Server responded with:', error.response.message);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error in setup:', error.message);
    }
    Alert.alert('Failed to update profile');
  }
};


const renderUserPost = () => (
  <View style={styles.meetupList}>
    {postData.post.map((item) => (
      <View
        key={item.PostID}
        activeOpacity={0.7}
        style={styles.postContainer}
    
       
      >
        <Image
          source={{ uri: item.images && item.images.length > 0 ? `${baseUrl}${item.images[0]}` : 'default_image_url' }}
          style={styles.postImage}
        />
        <View style={styles.postDetails}>
          <Text style={styles.postTitleText}>{item.HotelName}</Text>
          <Text style={styles.postLocation}>{item.Address}</Text>
          <Text style={styles.postPrice}>{item.price}$/night</Text>
          <Text style={styles.postRating}>⭐{item.rating}</Text>
        </View>
        <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="pencil" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
      </View>
    ))}
  </View>
);





const getUserPost = async (userID) =>{
      if(!userID){
        console.log('not found userID')
      }
      console.log(userID)
    
      try {
        setLoading2(true)
        const res = await axios.get(`${baseUrl}/api/getuserpost`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          userID: userID,
        },
      })
      // console.log(res.data)

      setPostData(res.data)
      
      
      } catch (error) {
        
      }finally{
        setLoading(false);
      }

}




  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
      <Image
      source={{ uri: imageUri }} 
      style={styles.profileImage}
      />

        <Text style={styles.profileName}>{uname}</Text>
        <View style={styles.followInfo}>
          <View style={styles.followInfoItem}>
            <Text style={styles.followCount}>{following}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
          <View style={styles.followInfoItem}>
            <Text style={styles.followCount}>{follower}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Icon name="pencil-outline" size={16} color="#4A55A2" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
      </View>

      {/* About Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.aboutText}>
          {desc || 'Enjoy your favorite dish and a lovely time with friends and family.'} <Text style={styles.readMore}>Read More</Text>
        </Text>
      </View>

      {/* post */}
      <View style={styles.section}>
        <View style={styles.interestHeader}>
          <Text style={styles.sectionTitle}>Post</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Icon name="pencil-outline" size={12} color="#4A55A2" />
            <Text style={styles.changeButtonText} onPress={() => setModalVisible2(true)}>create Post</Text>
          </TouchableOpacity>
         
        </View>
      </View>
        {postData && postData.post ? renderUserPost() : <Text>Loading...</Text>}

      {/* Modal for Editing Profile */}
      
<Modal
  visible={isModalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Profile</Text>

      {/* Email input */}
      <TextInput
        style={styles.modalInput}
        placeholder={email}
        value={newEmail}
        onChangeText={setNewEmail}
      />

      {/* Description input */}
      <TextInput
        style={styles.modalInput}
        placeholder={desc}
        value={newDesc}
        onChangeText={setNewDesc}
        multiline
      />

      {/* Image URL input with button inside */}
      <View style={styles.imageInputContainer}>
        <TextInput
          style={[styles.modalInput, styles.imageInput]}
          placeholder="Image URL"
          
        />
        <Button title="Upload" onPress={pickImageAsync} />
      </View>

      <View style={styles.modalButtons}>
        <Button title="Save Changes" onPress={handleSaveChanges} />
        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
      </View>
    </View>
  </View>
</Modal>

<Modal
  visible={isModalVisible2}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible2(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>CREATE A NEW POST</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.modalInput}
          placeholder="Hotel Name"
          value={postDetails.hotelname}  
          onChangeText={(text) => setPostDetails({ ...postDetails, hotelname: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="Address"
          value={postDetails.Address} 
          onChangeText={(text) => setPostDetails({ ...postDetails, Address: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="Price"
          value={postDetails.Price} 
          onChangeText={(text) => setPostDetails({ ...postDetails, Price: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="City"
          value={postDetails.city} 
          onChangeText={(text) => setPostDetails({ ...postDetails, city: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="Country"
          value={postDetails.country} 
          onChangeText={(text) => setPostDetails({ ...postDetails, country: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="Description"
          value={postDetails.describe} 
          onChangeText={(text) => setPostDetails({ ...postDetails, describe: text })}
          multiline
        />
        
        <TextInput
          style={styles.modalInput}
          placeholder="Addon"
          value={postDetails.Addon} 
          onChangeText={(text) => setPostDetails({ ...postDetails, Addon: text })}
          multiline
        />
        
        <View style={styles.imageInputContainer}>
          <Button title="Upload" onPress={pickImageAsyncMutilple} />
        </View>
        <ScrollView horizontal style={{ marginTop: 10 }}>
        {selectedImages.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 100, height: 100, margin: 5 }}
          />
        ))}
      </ScrollView>

        <View style={styles.modalButtons}>
          <Button title="Save Changes" onPress={createNewPost} />
          <Button title="Cancel" onPress={() => setModalVisible2(false)} color="red" />
        </View>
      </ScrollView>
    </View>
  </View>
</Modal>



    </ScrollView>
  );
};

const tagColors = ['#7B61FF', '#FF6D6D', '#FFA726', '#7E57C2', '#66BB6A', '#29B6F6'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  followInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  followInfoItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  followLabel: {
    fontSize: 12,
    color: '#777',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A55A2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#4A55A2',
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: '#4A55A2',
  },
  interestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E9FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeButtonText: {
    color: '#4A55A2',
    fontSize: 12,
    marginLeft: 4,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height:'70%',
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageInput: {
    flex: 1,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 10,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  postDetails: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  postTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postLocation: {
    fontSize: 14,
    color: 'gray',
  },
  postPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  postRating: {
    fontSize: 16,
    color: '#FFD700',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
  },
});

export default ProfileScreen;
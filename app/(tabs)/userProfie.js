import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,Alert,FlatList,ScrollView,Switch, StyleSheet, Platform, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import HotelDetailScreen from '../hotelDetail';
import UpdatePost from '../Partner/updatehotel';
import axios from 'axios';




let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const ProfileScreen = () => {
  const route = useRoute();
  const arr = route.params.username;
  const uname = arr[0];
  const uid = arr[1].uid;
  const userorl = arr[1].urole;

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
  
  const [data,setData] = useState([]);



  



  const getUser = async (uid) => {
    if (!uid) {
      console.log('Username is missing');
      return;
    }
    console.log(uid);
    try {
      const response = await axios.get(`${baseUrl}/api/getUserData`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          uid: uid,
        },
      });
      const data = response.data;
      console.log(data)
      setUID(data.ObjecID||'')
      setDesc(data.Desc || '');
      setEmail(data.Email || '');
      setFollower(data.followercount || 0);
      setFollowing(data.followingcount || 0);
      setUrole(data.urole || '');
      console.log(data.imgProfile)
      setImageUri(`${baseUrl}/api/image?imgid=${data.imgProfile}`)
     
      console.log(data)
     

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
  

const handleSaveChanges = async (uid) => {
  const formData = new FormData();
  
  
  console.log(uid)

  formData.append('uid',uid)
  formData.append('username', uname);
  formData.append('desc', newDesc);
  if (file) {
    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'upload.jpg', 
      type: file.mimeType || 'image/jpeg',  
    });
  }
  try {
      const response = await axios.post(`${baseUrl}/api/upload/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
         
      });

      if (response.status === 200) {
          Alert.alert('Profile updated successfully');
          setModalVisible(false);
          getUser(uid);
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
const openupdatemodal = (data) =>{
   setModalVisible2(true)
   setData(data)
}

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
        <TouchableOpacity style={styles.actionButton} onPress={()=>openupdatemodal(item)} >
          <Icon name="pencil" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}onPress={()=>deleteData(item.PostID)}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
      </View>
    ))}
  </View>
);
const renderhistory = () => {
  return (
    <View style={styles.meetupList}>
      {postData && postData.length > 0 ? (
        postData.map((item) => (
          <View key={item.orderid} style={styles.postContainer}>
            <View style={styles.postDetails}>
              <Text style={styles.postTitleText}>{item.HotelDetails.hotelName}</Text>
              <Text style={styles.postLocation}>{item.HotelDetails.Address}</Text>
              <Text style={styles.postLocation}>{item.checkoutDate}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No booking history found.</Text>
      )}
    </View>
  );
};
const deleteData = async (oid) => {
  const data = { id: oid }; 
  
  try {
    const res = await axios.post(
      `${baseUrl}/api/admin/deletehotel`,
      data, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.status === 200) {
      alert('Delete success');
   
      setData((prevData) => prevData.filter(item => item.PostID !== oid));
    } else {
      alert('Failed to delete');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to delete');
  }
};
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
      console.log(res.data.images)
      setPostData(res.data)
      
      
      } catch (error) {
        
      }finally{
        setLoading(false);
      }

}
const getUserhistory =async(userID)=>{
  if(!userID){
    console.log('not found userID')
  }
  console.log(userID)

  try {
    setLoading2(true)
    const res = await axios.get(`${baseUrl}/api/bookinghistory`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      userID: userID,
    },
  })
  
  console.log(res.data)
  setPostData(res.data)
  
  
  } catch (error) {
    
  }finally{
    setLoading(false);
  }
}


useEffect(() => {
  if (uid) {
    getUser(uid);
    if(userorl===1){
    getUserPost(uid);
    }
    if(userorl===2){
    getUserhistory(uid)
    }
  }
  

 
}, [uid]);
useEffect(()=>{
  console.log(data)

},[data])


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
        <TouchableOpacity style={styles.editButton}>
          <Icon name="pencil-outline" size={16} color="#4A55A2" />
          <Text style={styles.editButtonText}>Prenium subscription</Text>
        </TouchableOpacity>
        
      </View>

      {/* About Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.aboutText}>
          {desc || 'Enjoy your favorite dish and a lovely time with friends and family.'} <Text style={styles.readMore}>Read More</Text>
        </Text>
      </View>
      {urole === 1 ? (
        <View>
        <View style={styles.section}>
          <View style={styles.interestHeader}>
            <Text style={styles.sectionTitle}>Post</Text>
           
            
          </View>
        </View>
          {postData && postData.post ? renderUserPost() : <Text>Loading...</Text>}
          </View>
) : urole === 2 ? (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Your History:</Text>
     {postData  ? renderhistory() : <Text>Loading...</Text>}
  </View>
) : null}

      
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
        <Button title="Save Changes" onPress={()=>handleSaveChanges(uid)} />
        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
      </View>
    </View>
  </View>
</Modal>

  <Modal visible={isModalVisible2}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible2(false) }>

   <UpdatePost data={data}></UpdatePost>
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
    width: '100%',
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
    backgroundColor: 'wheat',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight:5,
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
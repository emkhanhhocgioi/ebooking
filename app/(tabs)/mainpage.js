import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Platform, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HotelDetailScreen from '../hotelDetail';
import axios from 'axios';

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const MainPage = () => {
  const [meetups, setMeetsup] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hotelData ,setHotelData] = useState(null)
  const navigation = useNavigation();
    
  const fetch10Post = async () => {
    try {
      setLoading(true); 
      const res = await axios.get(`${baseUrl}/api/getpost`);
      setMeetsup(res.data); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch10Post();
  }, []);

  useEffect(() => {
    if (meetups) {
      console.log('Updated meetups:', meetups.posts[0].PostID);
    }
  }, [meetups]);
  const handleButtonPress = (data) => {
    // Set data to be shown in the modal
    setModalVisible(true); // Show the modal
    console.log(data)
    setHotelData(data)
  };
  const renderMeetups = () => (
    <FlatList
      data={meetups.posts}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.meetupCard}
          onPress={() => handleButtonPress(item)}
        >
         
          <Image source={{ uri: `${baseUrl}${item.imgArr[0]}` }} style={styles.meetupImage} />

          <Text style={styles.locationText}>{item.Address}</Text>
          <Text style={styles.titleText}>{item.HotelName}</Text> 
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.PostID}
      contentContainerStyle={styles.meetupList}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>
  
      
  
      <View style={styles.iconsRow}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="camera-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="triangle-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="happy-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
  
      {/* Render meetups only if they are available */}
      {meetups && meetups.posts ? renderMeetups() : <Text>Loading...</Text>}
  
      <Modal
        data={hotelData}
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
            <HotelDetailScreen hotelData={hotelData}/>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#000',
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
  },
  meetupList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  meetupCard: {
    backgroundColor: '#F5DEB3',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  meetupImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%', 
    padding: 20,
    position: 'relative',  
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

export default MainPage;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Image,TextInput,ScrollView,Modal ,Platform, Alert} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { Button } from 'react-native-web';

var baseUrl = "http://localhost:5000";

if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
}
if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const ScheduleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const uid = route.params.uid;

  const [selectedCheckin, setSelectedCheckin] = useState([]);
  const [selectedCheckout, setSelectedCheckout] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [review, setReview] = useState('');
 
  const [rating, setRating] = useState(0);
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImages,setSelectedIamges] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);  
  const [selectedHotel, setSelectedHotel] = useState(null); 

  useEffect(() => {
    if (uid) {
      setUserID(uid);
    }
  }, [uid]);

  useEffect(() => {
    if (userID) {
      getSchedule();
    }
  }, [userID]);
  useEffect(() => {
    if (selectedHotel) {
      console.log(selectedHotel.HotelDetails.Address)
    }
  }, [selectedHotel]);
  useEffect(() => {
    if (scheduleData && Array.isArray(scheduleData)) {
      const dates = scheduleData.map(element => {
        const dateObj = new Date(element.checkinDate);
        return dateObj.toISOString().split('T')[0];
      });
      const dateout = scheduleData.map(element => {
        const dateObj = new Date(element.checkoutDate);
        return dateObj.toISOString().split('T')[0];
      });
      setSelectedCheckin(dates);
      setSelectedCheckout(dateout)
      console.log(scheduleData[0])
    }
  }, [scheduleData]);

  const pickImageAsyncMutilple = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let images = [...selectedImages];
      while (images.length < 2) { // Limit to 4 images
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled) {
          images.push(result.assets[0]); 
          setSelectedIamges(images);
        } else {
          break; // Exit if user cancels
        }
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not pick images.');
    }
  };
  

   
  const createReview = async (hotelid, reviewerId, reviewcontent, rating) => {

    if (!reviewcontent || !rating) {
      Alert.alert('Review content and rating cannot be empty');
      return;
    }
  
   
    let images = [...selectedImages];
    if (images.length < 2) {
      while (images.length < 2) {
        images.push({ uri: '', fileName: 'placeholder.jpg', mimeType: 'image/jpeg' });
      }
    }
  
    // Prepare form data
    const formData = new FormData();
    formData.append('hotelid', hotelid);
    formData.append('reviewerId', reviewerId);
    formData.append('reviewcontent', reviewcontent);
    formData.append('rating', Number(rating)); // Ensure rating is sent as a number
  
   
    images.forEach(image => {
      formData.append('file', {
        uri: image.uri,
        name: image.fileName || 'upload.jpg',
        type: image.mimeType || 'image/jpeg',
      });
    });
  
    try {
      
      const res = await axios.post(`${baseUrl}/api/createReview`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (res.status === 201) {
        Alert.alert('Review created successfully');
        setReview('');
        setRating(0);
        setSelectedIamges([]);
        setModalVisible(false);
      } else {
        console.log('Error creating review:', res.data || res.statusText);
      }
    } catch (error) {
      if (error.response) {
        console.log('Server responded with:', error.response.data.message || error.response.statusText);
        Alert.alert('Error', error.response.data.message || 'Something went wrong');
      } else if (error.request) {
        console.log('No response received:', error.request);
        Alert.alert('Error', 'Unable to connect to the server. Please try again.');
      } else {
        console.log('Error in setup:', error.message);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };
  

  const getSchedule = async () => {
    if (!userID) {
      console.log('UserID is missing:', userID);
      return;
    }

    try {
      const res = await axios.get(`${baseUrl}/api/getSchedule`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          userID: userID,
        },
      });

      if (res.data && res.data.length > 0) {
        
        setScheduleData(res.data);
      } else {
        
        console.log('No schedule data found');
      }
    } catch (error) {
      console.log('Error fetching schedule:', error);
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      {item.HotelDetails ? (
        <>
          <TouchableOpacity style={styles.hotelInfo}
          onPress={()=>{ 
            setModalVisible(true);
            setSelectedHotel(item)}
           
          }
          >
            <Text style={styles.hotelName}>{item.HotelDetails.hotelName}</Text>
            <Text style={styles.hotelDate}>{item.HotelDetails.Address}</Text>
            <Text style={styles.hotelPrice}>{item.HotelDetails.price}$</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </>
      ) : (
        <Text></Text>
      )}
    </View>
  );

  const mergedMarkedDates = {
    ...selectedCheckin.reduce((acc, date) => {
      acc[date] = { selected: true, marked: true, selectedColor: 'blue' };
      return acc;
    }, {}),
    ...selectedCheckout.reduce((acc, date) => {
      acc[date] = { selected: true, marked: true, selectedColor: 'red' }; 
      return acc;
    }, {}),
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Schedule</Text>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>

    <Calendar
      current={'2024-09-01'}
      markedDates={mergedMarkedDates}
      theme={{
        arrowColor: 'black',
        todayTextColor: '#00adf5',
        selectedDayBackgroundColor: 'blue',
      }}
      style={styles.calendar}
    />

    <View style={styles.scheduleHeader}>
      <Text style={styles.sectionTitle}>My Schedule</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>See all</Text>
      </TouchableOpacity>
    </View>

    {scheduleData && scheduleData.length > 0 ? (
      <FlatList
        data={scheduleData}
        renderItem={renderScheduleItem}
        keyExtractor={item => item.orderid}
        contentContainerStyle={styles.scheduleList}
      />
    ) : (
      <Text>No schedules available</Text>
    )}

    {/* Modal for showing hotel details */}
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>

        {selectedHotel && (
          <View style={styles.modalContent}>
            <Text style={styles.hotelName}>{selectedHotel.HotelDetails.hotelName}</Text>
            <Text style={styles.hotelDescription}>{selectedHotel.HotelDetails.Address}</Text>
            <Text style={styles.hotelDate}>
              {new Date(selectedHotel.checkinDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.hotelPrice}>{selectedHotel.HotelDetails.price}$/night</Text>

            {/* Review TextArea */}
            <TextInput
              style={styles.reviewInput}
              multiline
              numberOfLines={4}
              placeholder="Write your review here..."
              value={review}
              onChangeText={setReview}
            />
            <TouchableOpacity onPress={pickImageAsyncMutilple}>
            <Ionicons name="image" size={30} color="black" />
            </TouchableOpacity>
            {/* Star Rating */}
            <Text style={styles.ratingText}>Rate this hotel:</Text>
            <Rating
              showRating
              onFinishRating={(rating) => setRating(rating)} // Handle rating change
              startingValue={rating} // Initial value for the rating
              imageSize={30} // Set the size of the stars
              style={styles.rating} // Style for the rating component
            />
            <TouchableOpacity onPress={()=>{createReview(selectedHotel.HotelDetails.hotelid,userID,review,rating)}}>
            <Ionicons name="image" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendar: {
    marginBottom: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: 'blue',
    fontSize: 14,
  },
  scheduleList: {
    flexGrow: 0,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  hotelInfo: {
    flex: 1,
    marginLeft: 15,
  },
  hotelName: {
    fontWeight: 'bold',
  },
  hotelDate: {
    color: 'gray',
    marginVertical: 5,
  },
  hotelPrice: {
    color: 'blue',
    fontWeight: 'bold',
  },
  reviewInput: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ScheduleScreen;

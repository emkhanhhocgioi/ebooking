import React, { useEffect, useState } from 'react';
import { View,Button, Text,TextInput,Alert, Image, ScrollView, Platform, TouchableOpacity, StyleSheet, Modal } from 'react-native';  // Updated import
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const HotelDetailScreen = ({ hotelData,uid }) => {
  const [isModalVisible, setModalVisible] = useState(false);  
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [note,setNote] = useState('none');
  const [reviewData ,setReviewData] = useState([])
  const [rating,SetRating] = useState(0);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow2(false);
    setDate2(currentDate);
  };

const createOrders = async () => {
    console.log(date, date2);
    console.log(note);

    
    const payload = {
        HotelID: hotelData.PostID,
        UserID: uid,
        OwnerID:hotelData.PosterID,
        checkin: date.toISOString(),
        checkout: date2.toISOString(),  
        note: note
    };

    console.log(payload);  

    try {
      
        const res = await axios.post(`${baseUrl}/api/createorder`, payload, {
            headers: {
                'Content-Type': 'application/json',  
            },
        });

        if (res.status === 201) {
            Alert.alert('Booking created successfully');
        }
    } catch (error) {
        console.error('Error uploading:', error);
        if (error.response) {
            console.log('Server responded with:', error.response.data.message);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error in setup:', error.message);
        }
    }

    setModalVisible(false);
};
const renderReview = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/renderReview`, {
      headers: { 'Content-Type': 'application/json' },
      params: { hotelid: hotelData.PostID },
    });
    console.log(res.data[0]);
    setReviewData(res.data); 
  } catch (error) {
    console.log(error);
  }
};
const getReviewrating = async ()=>{
     try {
      const res = await axios.get(`${baseUrl}/api/countRating`, {
        headers: { 'Content-Type': 'application/json' },
        params: { postid: hotelData.PostID },
      });
      console.log(res.data)
      SetRating(res.data)
     } catch (error) {
      console.log(error);
     }
}

useEffect(() => {
  renderReview();
  getReviewrating();
}, []);
   
  



  const renderUserPost = () => {
    if (Array.isArray(reviewData) && reviewData.length === 0) {
      return <Text>No comments available</Text>;
    }
  
    return (
      <View style={styles.meetupList}>
        {reviewData.map((item) => (
          <View
            key={item.rvid}
            activeOpacity={0.7}
            style={styles.postContainer}
          >
            <View style={styles.postDetails}>
              <Text style={styles.postTitleText}>{item.ReviewerID}</Text>
              <Text style={styles.postLocation}>{item.reviewcontent}</Text>
              <Text style={styles.postRating}>⭐{item.rating}</Text>
              <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    item.imgArr && item.imgArr.length > 0
                      ? `${baseUrl}${item.imgArr[0]}`
                      : 'default_image_url',
                }}
                style={styles.postImage}
              />
              <Image
                source={{
                  uri:
                    item.imgArr && item.imgArr.length > 0
                      ? `${baseUrl}${item.imgArr[1]}`
                      : 'default_image_url',
                }}
                style={styles.postImage}
              />
            </View>
            </View>
            
          </View>
        ))}
      </View>
    );
  };
  
 

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      
      
      </View>

      {/* Hotel Image */}
      <Image
        source={{ uri: `${baseUrl}${hotelData.imgArr[0]}` }}
        style={styles.hotelImage}
      />

      {/* Hotel Info */}
      <View style={styles.infoContainer}>
        {/* Amenities */}
        <View style={styles.amenities}>
         
          <View style={styles.amenityItem}>
            <Image source={require('C:/Users/hidra/GK2/assets/images/food.jpg')} style={styles.amenityIcon} />
            <Text style={styles.amenityText}>{hotelData.addon}</Text>
            
        
          </View>
          <TouchableOpacity style={styles.amenityItem}>
          <Image source={require('C:/Users/hidra/GK2/assets/images/heart.jpg')} style={styles.heartIcon} />
          <Text style={styles.amenityText}>Favourite</Text>
        </TouchableOpacity>
          
          <View style={styles.amenityItem}>
            <Text style={styles.ratingText}>{rating}⭐</Text>
          </View>
        </View>

        {/* Hotel Details */}
        <Text style={styles.hotelName}>{hotelData.HotelName}</Text>
        <Text style={styles.locationText}>{hotelData.Address + ',' + hotelData.city + "," + hotelData.country}</Text>
        <Text style={styles.priceText}>{hotelData.price}$ <Text style={styles.perNight}>/night</Text></Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          Aston {hotelData.describe}
          <Text style={styles.readMore}>Read More...</Text>
        </Text>

        {/* Preview Images */}
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          <Image source={{ uri: `${baseUrl}${hotelData.imgArr[1]}` }} style={styles.previewImage} />
          <Image source={{ uri: `${baseUrl}${hotelData.imgArr[2]}` }} style={styles.previewImage} />
          <Image source={{ uri: `${baseUrl}${hotelData.imgArr[3]}` }} style={styles.previewImage} />
        </View>
        <Text style={styles.sectionTitle}>Review</Text>
        {reviewData.length > 0 ? renderUserPost() : <Text>No comments on this hotel.</Text>}
        {/* Booking Button */}
        <TouchableOpacity style={styles.bookingButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.bookingButtonText}>Booking Now</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal */}
      <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.selectedDateContainer}>

          <View style={styles.dateRow}>
            <Button title="Select Date" onPress={() => setShow(true)} />
            <Text style={styles.dateText}>Check In Date: {date.toDateString()}</Text>
          </View>
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}

          <View style={styles.dateRow}>
            <Button title="Select Date" onPress={() => setShow2(true)} />
            <Text style={styles.dateText}>Check Out Date: {date2.toDateString()}</Text>
          </View>
          {show2 && (
            <DateTimePicker
              value={date2}
              mode="date"
              display="default"
              onChange={onChange2}
            />
          )}

          <TextInput
            placeholder="Add a note"
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
          />
          <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => createOrders()}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Book</Text>
          </TouchableOpacity>
        </View>
        </View>

     
        
      </View>
    </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    fontSize: 24,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heartIcon: {
    width: 24,
    height: 24,
  },
  hotelImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    padding: 20,
  },
  amenities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  perNight: {
    fontSize: 14,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: '#007BFF',
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  previewImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  bookingButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    width:'100%',
    height:'50%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  selectedDateContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
  },
  noteInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#32CD32',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    width: '90%',

    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',  
    alignItems: 'center',   
  },
  postImage: {
    width: 60,
    height: 60,
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
  
});

export default HotelDetailScreen;

import React from 'react';
import { View, Text, Image, ScrollView,Platform, TouchableOpacity, StyleSheet } from 'react-native';
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}
const HotelDetailScreen = ({hotelData}) => {
  if(!hotelData){
    console.log('nothing')
  }else{
    console.log('something')
  }
  console.log(hotelData)
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        {/* Heart Icon */}
        <TouchableOpacity style={styles.heartIconContainer}>
          <Image source={require('C:/Users/hidra/GK2/assets/images/heart.jpg')} style={styles.heartIcon} />
        </TouchableOpacity>
      </View>

      {/* Hotel Image */}
      <Image
        source={{uri: `${baseUrl}${hotelData.imgArr[0]}`}}
        style={styles.hotelImage}
      />

      {/* Hotel Info */}
      <View style={styles.infoContainer}>
        {/* Amenities */}
        <View style={styles.amenities}>
          <View style={styles.amenityItem}>
            <Image source={require('C:/Users/hidra/GK2/assets/images/wifi.jpg')} style={styles.amenityIcon} />
            <Text style={styles.amenityText}>Free Wifi</Text>
          </View>
          <View style={styles.amenityItem}>
            <Image source={require('C:/Users/hidra/GK2/assets/images/food.jpg')} style={styles.amenityIcon} />
            <Text style={styles.amenityText}>Free Breakfast</Text>
          </View>
          <View style={styles.amenityItem}>
            <Text style={styles.ratingText}>⭐ 5.0</Text>
          </View>
        </View>

        {/* Hotel Details */}
        <Text style={styles.hotelName}>{hotelData.HotelName}</Text>
        <Text style={styles.locationText}>{hotelData.Address+','+hotelData.city+","+hotelData.country}</Text>
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
          <Image source={{uri: `${baseUrl}${hotelData.imgArr[1]}`}} style={styles.previewImage} />
          <Image source={{uri: `${baseUrl}${hotelData.imgArr[2]}`}} style={styles.previewImage} />
          <Image source={{uri: `${baseUrl}${hotelData.imgArr[3]}`}} style={styles.previewImage} />
        </View>

        {/* Booking Button */}
        <TouchableOpacity style={styles.bookingButton}>
          <Text style={styles.bookingButtonText}>Booking Now</Text>
        </TouchableOpacity>
      </View>
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
    top: 10,          // Cách phía trên ảnh 10px
    right: 10,        // Cách phải 10px
    backgroundColor: 'white',  // Nền trắng để nổi bật
    borderRadius: 20, // Bo tròn nền biểu tượng
    padding: 5,       // Khoảng cách xung quanh biểu tượng
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
  infoContainer: {
    padding: 20,
  },
  hotelImage: {
    width: '100%',               // Chiếm toàn bộ chiều ngang
    height: undefined,           // Để duy trì tỉ lệ của ảnh
    aspectRatio: 16 / 9,         // Tỉ lệ 16:9 như ảnh gốc
    borderRadius: 15,            // Bo tròn 15px cả 4 góc
    marginVertical: 10,          // Khoảng cách trên dưới
    shadowColor: "#000",         // Màu đổ bóng
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,         // Độ mờ của bóng
    shadowRadius: 3.84,          // Bán kính đổ bóng
    elevation: 5,                // Hiệu ứng nổi trên Android
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
});

export default HotelDetailScreen;
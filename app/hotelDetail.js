import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const HotelDetailScreen = () => {
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
        source={require('C:/Users/hidra/GK2/assets/images/main.png')}
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
        <Text style={styles.hotelName}>The Aston Vill Hotel</Text>
        <Text style={styles.locationText}>Alice Springs NT 0870, Australia</Text>
        <Text style={styles.priceText}>$200.7 <Text style={styles.perNight}>/night</Text></Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          Aston Hotel, Alice Springs NT 0870, Australia is a modern hotel, elegant 5-star hotel overlooking the sea. Perfect for a romantic, charming <Text style={styles.readMore}>Read More...</Text>
        </Text>

        {/* Preview Images */}
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          <Image source={require('C:/Users/hidra/GK2/assets/images/hotelex.jpg')} style={styles.previewImage} />
          <Image source={require('C:/Users/hidra/GK2/assets/images/hotelex.jpg')} style={styles.previewImage} />
          <Image source={require('C:/Users/hidra/GK2/assets/images/hotelex.jpg')} style={styles.previewImage} />
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
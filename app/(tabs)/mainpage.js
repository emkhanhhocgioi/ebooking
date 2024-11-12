import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HotelDetailScreen from '../hotelDetail';

const meetups = [
  {
    id: '1',
    location: 'USA, Los Angeles - 2 Weeks',
    title: 'City of Los Angeles',
    image: require('C:/Users/hidra/GK2/assets/images/main.png'),
  },
  {
    id: '2',
    location: 'USA, New York - 3 Weeks',
    title: 'City of New York',
    image: require('C:/Users/hidra/GK2/assets/images/main.png'),
  },
  {
    id: '3',
    location: 'USA, New York - 3 Weeks',
    title: 'City of New York',
    image: require('C:/Users/hidra/GK2/assets/images/main.png'),
  },
  {
    id: '4',
    location: 'USA, New York - 3 Weeks',
    title: 'City of New York',
    image: require('C:/Users/hidra/GK2/assets/images/main.png'),
  },
  {
    id: '5',
    location: 'USA, New York - 3 Weeks',
    title: 'City of New York',
    image: require('C:/Users/hidra/GK2/assets/images/main.png'),
  },
];

const MainPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const renderMeetupItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.meetupCard}
      onPress={() => setModalVisible(true)}>
      <Image source={item.image} style={styles.meetupImage} />
      <Text style={styles.locationText}>{item.location}</Text>
      <Text style={styles.titleText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>

      <Text style={styles.title}>Upcoming meetups</Text>

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

      <FlatList
        data={meetups}
        renderItem={renderMeetupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.meetupList}
      />

      <Modal
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
            <HotelDetailScreen />
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
    backgroundColor: '#E6F0FF',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // To give a dimmed background
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',  // Make modal content take full screen
    padding: 20,
    position: 'relative',  // So we can position the close button absolutely
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

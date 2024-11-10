import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const renderMeetupItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.meetupCard} onPress={() => navigation.navigate('hoteldetail')}>
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

      {/* Bottom Navbar */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TripsScreen')}>
          <Icon name="map-outline" size={24} color="#000" />
          <Text style={styles.navText}>Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('profile')}>
          <Icon name="person-outline" size={24} color="#000" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SettingsScreen')}>
          <Icon name="settings-outline" size={24} color="#000" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View> */}
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#000',
  },
});

export default MainPage;

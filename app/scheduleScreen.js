import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2024-09-19');

  const scheduleData = [
    {
      id: '1',
      hotelName: 'The Aston Vill Hotel',
      date: '19 March 2024',
      price: '$200.7 /night',
      image: 'https://link-to-hotel1-image.com',
    },
    {
      id: '2',
      hotelName: 'Golden Palace Hotel',
      date: '25 March 2024',
      price: '$175.9 /night',
      image: 'https://link-to-hotel2-image.com',
    },
  ];

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        <Text style={styles.hotelDate}>{item.date}</Text>
        <Text style={styles.hotelPrice}>{item.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Calendar
        current={'2024-09-01'}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
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

      <FlatList
        data={scheduleData}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        style={styles.scheduleList}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={28} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={28} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={28} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={28} color="gray" />
        </TouchableOpacity>
      </View>
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
  hotelImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default ScheduleScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Image, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const ScheduleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const uid = route.params.uid;

  const [selectedCheckin, setSelectedCheckin] = useState([]);
  const [selectedCheckout, setSelectedCheckout] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [userID, setUserID] = useState('');
  const [loading, setLoading] = useState(true);

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
        setScheduleData([]);
        console.log('No schedule data found');
      }
    } catch (error) {
      console.log('Error fetching schedule:', error);
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
    
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.HotelDetails.hotelName}</Text>
        <Text style={styles.hotelDate}>{item.HotelDetails.Address}</Text>
        <Text style={styles.hotelPrice}>{item.HotelDetails.price}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
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

      <FlatList
        data={scheduleData}
        renderItem={renderScheduleItem}
        keyExtractor={item => item.orderid} 
        contentContainerStyle={styles.scheduleList}
      />
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
});

export default ScheduleScreen;

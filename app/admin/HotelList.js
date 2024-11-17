import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const baseUrl = "http://localhost:5000"; // Update with your actual base URL

const HotelList = () => {
  const [data, setData] = useState([]);

  const getHotelData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/gethotel`);
      if (response) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const deleteData = async (oid) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin/deletehotel`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            id: oid,
          },
        }
      );
      if (res) {
        Alert.alert('Delete success');

 
        setData(prevData => prevData.filter(item => item.PostID !== oid));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to delete');
    }
  };


  useEffect(() => {
    getHotelData();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.PostID.toString()} 
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.PostID}</Text>
          <Text style={styles.listItemText}>{item.PosterID}</Text>
          <Text style={styles.listItemText}>{item.PhoneNumber}</Text>
          <Text style={styles.listItemText}>{item.HotelName}</Text>
          <Text style={styles.listItemText}>{item.Address}</Text>
          <Text style={styles.listItemText}>{item.price}</Text>
          <Text style={styles.listItemText}>{item.city}</Text>
          <Text style={styles.listItemText}>{item.country}</Text>
          <Text style={styles.listItemText}>
            {item.tkdetails && item.tkdetails.Username ? item.tkdetails.Username : 'No Username'}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item.PostID)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    alignItems: 'center',  
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    flex: 1,  
    fontSize: 16,
    marginRight: 10,  
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HotelList;

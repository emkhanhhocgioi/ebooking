import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';  

const baseUrl = "http://localhost:5000";

const ReviewList = () => {
  const [data, setData] = useState([]);

  const deleteData = async (oid) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin/deletereview`,
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
        
       
        setData(prevData => prevData.filter(item => item.ReviewID !== oid));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to delete');
    }
  };

  
  const getReviewData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/getreview`);
      if (response) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    getReviewData();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.ReviewID.toString()} 
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.ReviewID}</Text>
          <Text style={styles.listItemText}>{item.HotelID}</Text>
          <Text style={styles.listItemText}>{item.ReviewerID}</Text>
          <Text style={styles.listItemText}>{item.reviewcontent}</Text>
          <Text style={styles.listItemText}>{item.orderDay}</Text>
          <Text style={styles.listItemText}>{item.orderStatus}</Text>

          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item.ReviewID)}>
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

export default ReviewList;

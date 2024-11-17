import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const baseUrl = "http://localhost:5000"; // Update with your actual base URL

const OrderList = () => {
  const [data, setData] = useState([]);

  // Function to fetch order data
  const getOrderData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/getorder`);
      if (response) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete an order
  const deleteData = async (oid) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/admin/deleteorder`, // Make sure the endpoint is correct
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
        
        // Remove the deleted order from the state
        setData(prevData => prevData.filter(item => item.id !== oid));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to delete');
    }
  };

  // Fetch order data when component mounts
  useEffect(() => {
    getOrderData();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()} // Ensure id is unique
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.Customerid}</Text>
          <Text style={styles.listItemText}>{item.Hotelid}</Text>
          <Text style={styles.listItemText}>{item.Checkindate}</Text>
          <Text style={styles.listItemText}>{item.Checkoutdate}</Text>
          <Text style={styles.listItemText}>{item.orderDay}</Text>
          <Text style={styles.listItemText}>{item.orderStatus}</Text>
          
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item.id)}>
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

export default OrderList;

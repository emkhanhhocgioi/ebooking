import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Button ,Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

var baseUrl = "http://localhost:5000";

if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
}
if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}
const Orderlist = () => {
  const route = useRoute();
  const uid = route.params.uid;

  const [UserID, setUserId] = useState('');
  const [Orderdata, setData] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState({}); // To store statuses of orders
  const [isModalVisible, setModalVisible] = useState(false); // To manage modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // To store selected order for modal actions

  // Fetch booked orders based on UserID
  useEffect(() => {
    if (uid) {
      setUserId(uid); // Set UserID from route params
    }
  }, [uid]);

  useEffect(() => {
    if (UserID) {
      getincomingBooked();
    }
  }, [UserID]);
  
  useEffect(() => {
    if (selectedOrder) {
     
    }
  }, [selectedOrder]);


  const AcceptedBooked = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id); 
    try {
      const res = await axios.post(
        `${baseUrl}/api/accpetorder`,
        { orderid: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Order Accepted!');
      setOrderStatuses((prev) => ({ ...prev, [id]: 'Accepted' })); 
    } catch (error) {
      console.log('Error denying order:', error);
    }
  };
  

  const DeniedBooked = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id); 
    try {
      const res = await axios.post(
        `${baseUrl}/api/deniedOrder`,
        { orderid: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Order Denied!');
      setOrderStatuses((prev) => ({ ...prev, [id]: 'Denied' })); 
    } catch (error) {
      console.log('Error denying order:', error);
    }
  };
  const CheckinOrder = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id); 
    try {
      const res = await axios.post(
        `${baseUrl}/api/checkin`,
        { orderid: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Order Check In!');
      setOrderStatuses((prev) => ({ ...prev, [id]: 'Check in' })); 
    } catch (error) {
      console.log('Error denying order:', error);
    }
  };
  const CheckoutOrder = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id); 
    try {
      const res = await axios.post(
        `${baseUrl}/api/checkout`,
        { orderid: id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Order Check out!');
      setOrderStatuses((prev) => ({ ...prev, [id]: 'Check out' })); 
    } catch (error) {
      console.log('Error denying order:', error);
    }
  };
  


  

  const getincomingBooked = async () => {
    if (!UserID) {
      console.log('UserID is missing:', UserID);
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/api/getbooked`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          userID: UserID,
        },
      });

      if (res.data && res.data.length > 0) {
        setData(res.data);

        
        const updatedStatuses = {};
        res.data.forEach((order) => {
          updatedStatuses[order.OrderID] = order.orderStatus; 
        });

        setOrderStatuses(updatedStatuses); 
      } else {
        setData([]);
        console.log('No orders found');
      }
    } catch (error) {
      console.log('Error fetching booked orders:', error);
    }
  };

  const renderUserOrder = () => (
    <View style={styles.meetupList}>
      {Orderdata && Array.isArray(Orderdata) && Orderdata.length > 0 ? (
        Orderdata.map((item) => (
          <TouchableOpacity key={item.OrderID} style={styles.postContainer}
          onPress={() => {
            setSelectedOrder(item); 
            // console.log(item)
            setModalVisible(true); 
          }}
          >
            <View style={styles.postDetails}>
              <Text style={styles.postTitleText}>OrderID: {item.OrderID}</Text>
              <Text style={styles.postLocation}>
                Check-in: {new Date(item.Checkindate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.postLocation}>
                Check-out: {new Date(item.Checkoutdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              {orderStatuses[item.OrderID] ? (
                <Text style={styles.orderStatusText}>{orderStatuses[item.OrderID]}</Text>
              ) : (
                <>
                 
                </>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noDataText}>No orders found.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headers}>
        <Text style={styles.headersText}>Notification</Text>
        <Icon style={styles.iconStyle} name="notifications-outline" size={20} />
      </View>
      {Orderdata ? renderUserOrder() : <Text>There is nothing here...</Text>}

      {/* Modal for Order Actions */}
      {selectedOrder && (
  <Modal
    visible={isModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Accepted this proposal?</Text>
        <Text style={styles.modalMessage}>
          {selectedOrder.tkDetails?.name}
        </Text>
        <Text style={styles.modalMessage}>
          {selectedOrder.tkDetails?.email}
        </Text>
        <Text style={styles.modalMessage}>
          {selectedOrder.tkDetails?.phoneNumber}
        </Text>
        
        {selectedOrder.orderStatus === 'Accepted' ? (
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => CheckinOrder(selectedOrder.OrderID)}
              >
                <Icon name="checkmark" size={20} color="blue" />
                <Text>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => CheckoutOrder(selectedOrder.OrderID)}
              >
                <Icon name="close" size={20} color="red" />
                <Text>Check Out</Text>
              </TouchableOpacity>
              
            </View>
          ) : selectedOrder.orderStatus === 'Checkin' ? (
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => CheckoutOrder(selectedOrder.OrderID)}
              >
                <Icon name="close" size={20} color="red" />
                <Text>Check Out</Text>
              </TouchableOpacity>
              
            
            </View>
          ) : (
            <View style={styles.modalButtons}>
              <Text style={styles.infoText}>
                No actions available for this order status.
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModal}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.closeModal}>Cancel</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  </Modal>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headers: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconStyle: {
    color: '#fff',
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  postDetails: {
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
  },
  orderStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  closeModal: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});

export default Orderlist;

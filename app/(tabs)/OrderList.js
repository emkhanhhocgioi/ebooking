import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Button,ScrollView ,Platform} from 'react-native';
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
  const [orderStatuses, setOrderStatuses] = useState({}); 
  const [isModalVisible, setModalVisible] = useState(false); 
  const [selectedOrder, setSelectedOrder] = useState(null); 


  useEffect(() => {
    if (uid) {
      setUserId(uid); 
    }
  }, []);

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
      getincomingBooked();
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
      getincomingBooked();
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
      getincomingBooked();
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
      getincomingBooked();
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
  
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {Orderdata ? renderUserOrder() : <Text>There is nothing here...</Text>}
  
      {selectedOrder && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Booking Details</Text>
            <View style={styles.modalRow}>
                    <View style={styles.detailColumn}>
                      <Text style={styles.modalMessage}>Owner ID: {selectedOrder.OwnerID}</Text>
                      <Text style={styles.modalMessage}>Hotel ID: {selectedOrder.HotelID}</Text>
                      <Text style={styles.modalMessage}>
                        Check-in date: {new Date(selectedOrder.Checkindate).toLocaleDateString()}
                      </Text>
                      <Text style={styles.modalMessage}>
                        Check-out date: {new Date(selectedOrder.Checkoutdate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailColumn}>
                      <Text style={styles.modalMessage}>
                        Username: {selectedOrder.tkDetails?.name}
                      </Text>
                      <Text style={styles.modalMessage}>
                        email: {selectedOrder.tkDetails?.email}
                      </Text>
                      <Text style={styles.modalMessage}>
                        phone number: {selectedOrder.tkDetails?.phoneNumber}
                      </Text>
                    </View>
                  </View>
  
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
              ) : selectedOrder.orderStatus === 'Pending' ? (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => AcceptedBooked(selectedOrder.OrderID)}
                  >
                    <Icon name="checkmark" size={20} color="blue" />
                    <Text>Accepted</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => DeniedBooked(selectedOrder.OrderID)}
                  >
                    <Icon name="close" size={20} color="blue" />
                    <Text>Denied</Text>
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
    </ScrollView>
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
    backgroundColor: 'wheat',
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
    color: 'blacks',
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
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: 'black',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    width: '45%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  closeModal: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default Orderlist;

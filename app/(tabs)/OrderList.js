import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Alert } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Orderlist = () => {
  const route = useRoute();
  const uid = route.params.uid;
  
  
 
  const [UserID,setUserId] = useState('')
  const [Orderdata,setData] = useState(null)
  const [OrderID,SetOrderID] = useState(null)
  const [HotelID,setHotelId] = useState('')
  const [Checkindate,setCheckinDate] = useState('')
  const [Checkin,setCheckin] = useState('')
  const [Checkout,setCheckout]= useState('')
  const [Note,setNote] = useState('')
  const [orderDay,setOrderday] = useState('')
  const [orderStatus,setOrderStatus] =useState('')

  useEffect(() => {
    if(uid){
      setUserId(uid); 
      console.log(UserID)
      if(UserID){
        getincomingBooked();
      }
    
    }
     
 
  }, [UserID]);
  const AcceptedBooked = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id)
    try {
      const res = await axios.post(
        `${baseUrl}/api/accpetOrder`,
        { orderid: id },             
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Accepted Order !')
       
      getincomingBooked();                     
    } catch (error) {
      console.log(error);
    }
  };
  const DeniedBooked = async (id) => {
    if (!id) {
      console.log('No order ID');
      return;
    }
    console.log(id)
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
      Alert.alert('Denied Order !')
       
      getincomingBooked();                     
    } catch (error) {
      console.log(error);
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
        console.log(res.data)
        setData(res.data);
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
      {Orderdata && Array.isArray(Orderdata) && Orderdata.length > 0 ?  (
        Orderdata.map((item) => (
          <View key={item.OrderID} style={styles.postContainer}>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => AcceptedBooked(item.OrderID)}
              >
                <Icon name="checkmark" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => DeniedBooked(item.OrderID)}
              >
                <Icon name="close" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
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
      {Orderdata ? renderUserOrder() : <Text>There nothing here...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  headers: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space out text and icon
    marginBottom: 10,
  },
  headersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconStyle: {
    marginRight: 0, // Remove margin as `space-between` handles alignment
    color: '#fff', // Match icon color with text
  },
  text: {
    fontSize: 18,
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    marginTop: 10,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  postDetails: {
    marginLeft: 10,
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
  postPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  postRating: {
    fontSize: 16,
    color: '#FFD700',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
  },
  
});

export default Orderlist ;

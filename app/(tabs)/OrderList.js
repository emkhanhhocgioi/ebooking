import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
const Orderlist = () => {
  const route = useRoute();
  const uid = route.params.uid;

  console.log('order:'+UserID)
  
 
  const [UserID,setUserId] = useState('')
  const [HotelID,setHotelId] = useState('')
  const [Checkindate,setCheckinDate] = useState('')
  const [Checkin,setCheckin] = useState('')
  const [Checkout,setCheckout]= useState('')
  const [Note,setNote] = useState('')
  const [orderDay,setOrderday] = useState('')
  const [orderStatus,setOrderStatus] =useState('')

  useEffect(() => {
    if (uid) {
      setUserId(uid); 
      getincomingBooked(uid);
    }
  }, [uid]);
  const getincomingBooked = async (uid) =>{
       if(!uid){
        console.log('no user id')
       }
       try {
        const res  =  await axios.get(`${baseUrl}/api/createpost`,{
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            username: uname,
          },
        })
        console.log(res.data)
       } catch (error) {
        console.log(error)
       }
  }
  return (
    <View style={styles.container}>
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      /> */}
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
  text: {
    fontSize: 18,
  },
});

export default Orderlist ;

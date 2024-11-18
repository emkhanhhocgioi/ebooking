import React ,{useState,useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,Alert,Platform
} from 'react-native';
import axios from 'axios';

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}
const DestinationScreen = () => {
    const [data, setData] = useState([]);

    
    const getDestinationData = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/getDestination`);
          if (response.data) {
            
            setData(response.data);
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error fetching data');
        }
      };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: `${baseUrl}${item.img}` }} style={styles.image} />
      <View style={styles.info}>
        
        <Text style={styles.city}>{item.destname}</Text>
        <Text style={styles.description}>{item.desc}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );
  useEffect(() => {
    getDestinationData();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>DONT KNOW WHERE TO GO ON YOUR HOLIDAY</Text>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} 
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text>No destinations available</Text> 
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  city: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  priceContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  price: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DestinationScreen;

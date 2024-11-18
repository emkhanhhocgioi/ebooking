import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import axios from 'axios';

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const DestinationInput = () => {
  const [data, setData] = useState([]);
  const [destName, setDestName] = useState('');
  const [destdesc, setDestDesc] = useState('');
  const [image, setImage] = useState(null);

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

  const createDest = async () => {
    if (!destName) {
      Alert.alert('Missing destination name');
      return; 
    }
    if (!destdesc) {
      Alert.alert('Missing destination description');
      return;  
    }
    if (!image) {
      Alert.alert('Missing destination image');
      return;  
    }

    const formData = new FormData();
    formData.append('DestinationName', destName);
    formData.append('DestinationDesc', destdesc);
    formData.append('file', image);

    try {
      const res = await axios.post(`${baseUrl}/api/admin/createdestination`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data) {
        Alert.alert('Create new Destination success');
        getDestinationData(); // Reload the data after creation
      }
    } catch (error) {
      console.error('Error creating destination:', error);
      Alert.alert('Error creating destination');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    getDestinationData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {/* Title for destination list */}
      <Text style={styles.title}>Destination List</Text>

      {/* Header row for columns */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Destination Name</Text>
        <Text style={styles.headerText}>Description</Text>
        <Text style={styles.headerText}>Actions</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listItemColumn}>
              <Text style={styles.listItemText}>{item.destname}</Text>
            </View>
            <View style={styles.listItemColumn}>
              <Text style={styles.listItemText}>{item.desc}</Text>
            </View>
            <View style={styles.listItemColumn}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteData(item._id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      {/* Form to create new destination */}
      <Text style={styles.createTitle}>Create New Destination</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Destination Name"
        value={destName}
        onChangeText={setDestName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Destination Description"
        value={destdesc}
        onChangeText={setDestDesc}
      />
      {Platform.OS === 'web' && (
        <input
          type="file"
          onChange={handleFileSelect}
          style={styles.fileInput}
        />
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={createDest}>
        <Text style={styles.uploadButtonText}>Create Destination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  createTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#5bc0de',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',  
    justifyContent: 'space-between', 
    alignItems: 'center',  
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 16,
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
  fileInput: {
    display: 'none',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});

export default DestinationInput;

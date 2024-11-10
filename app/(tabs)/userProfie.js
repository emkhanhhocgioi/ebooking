import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

let baseUrl = "http://localhost:5000";
if (Platform.OS === "android") {
  baseUrl = "http://10.0.2.2:5000";
} else if (Platform.OS === "ios") {
  baseUrl = "http://172.20.10.9:5000";
}

const ProfileScreen = () => {
  const route = useRoute();
  const uname = route.params?.username;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [desc, setDesc] = useState('');
  const [following, setFollowing] = useState('');
  const [follower, setFollower] = useState('');
  const [urole, setUrole] = useState('');
  const [imgPrf, setImgPrf] = useState('');

  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [newEmail, setNewEmail] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const getUser = async (uname) => {
    if (!uname) {
      console.log('Username is missing');
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/api/getUserData`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          username: uname,
        },
      });
      const data = response.data;

      setDesc(data.Desc || '');
      setEmail(data.Email || '');
      setFollower(data.followercount || 0);
      setFollowing(data.followingcount || 0);
      setUrole(data.urole || '');
      setImgPrf(data.imgProfile || '');

      // Initialize the modal fields with current data
      setNewEmail(data.Email || '');
      setNewDesc(data.Desc || '');

      console.log(data);

    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (uname) {
      getUser(uname);
    }
  }, [uname]);

  const handleSaveChanges = async () => {
    try {
        const response = await axios.post(`${baseUrl}/api/update`, {
            username: uname,
            email: newEmail,
            desc: newDesc,
        });

        if (response.status === 200) {
            alert('Profile updated successfully');
            setModalVisible(false);  // Hide modal
            getUser(uname);  // Fetch the updated user data
        }
    } catch (error) {
        console.log('Error updating data:', error.response || error);
        alert('Failed to update profile');
    }
};



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: imgPrf || 'https://via.placeholder.com/100' }} // Use imgPrf if available
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{uname}</Text>
        <View style={styles.followInfo}>
          <View style={styles.followInfoItem}>
            <Text style={styles.followCount}>{following}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
          <View style={styles.followInfoItem}>
            <Text style={styles.followCount}>{follower}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Icon name="pencil-outline" size={16} color="#4A55A2" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* About Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.aboutText}>
          {desc || 'Enjoy your favorite dish and a lovely time with friends and family.'} <Text style={styles.readMore}>Read More</Text>
        </Text>
      </View>

      {/* Interest Section */}
      <View style={styles.section}>
        <View style={styles.interestHeader}>
          <Text style={styles.sectionTitle}>Interest</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Icon name="pencil-outline" size={12} color="#4A55A2" />
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.interestTags}>
          {['Games Online', 'Concert', 'Music', 'Art', 'Movie', 'Others'].map((interest, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: tagColors[index % tagColors.length] }]}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modal for Editing Profile */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Email input */}
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            {/* Description input */}
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
            />

            <View style={styles.modalButtons}>
              <Button title="Save Changes" onPress={handleSaveChanges} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const tagColors = ['#7B61FF', '#FF6D6D', '#FFA726', '#7E57C2', '#66BB6A', '#29B6F6'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  followInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  followInfoItem: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  followCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  followLabel: {
    fontSize: 12,
    color: '#777',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A55A2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#4A55A2',
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: '#4A55A2',
  },
  interestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E9FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeButtonText: {
    color: '#4A55A2',
    fontSize: 12,
    marginLeft: 4,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  modalButtons: {
    width: '100%',
    marginTop: 10,
  },
});

export default ProfileScreen;

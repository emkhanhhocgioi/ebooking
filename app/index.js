import { TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from 'expo-router';

const index = () => {


  return (
    <View style={styles.container}>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee', // Button color
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%', // Width of the button
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default index;

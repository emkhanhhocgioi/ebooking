
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';


import StartPage from './StarterPage';
import Inputs from './(tabs)/inputs';
import LIST from './(tabs)/LIST';



import Homscreen from './(tabs)/home';

import HotelDetailScreen from './hotelDetail';
import UpdateProfileScreen from './updateProfile';
import SignUpScreenCustomer from './auth/SignUpScreen';
import SignUpScreenPartner from './auth/SignupScreenP';
import Dashboard from './admin/AdminDashboard';
import DestinationScreen from './blog/DestinationScreen';
import LoginScreen from './auth/LoginSceen';
const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="startPage">
        <Stack.Screen name="startPage" component={StartPage}  options={{ headerShown: false}} />
          <Stack.Screen name="list" component={LIST} options={{ headerShown: false}}  />
          <Stack.Screen name="ip" component={Inputs} options={{ headerShown: false}} />
        
          <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false}} />
          <Stack.Screen name="signup" component={SignUpScreenCustomer} options={{ headerShown: false}} />
          <Stack.Screen name="home" component={Homscreen} options={{ headerShown: false}} />
          <Stack.Screen name="signupP" component={SignUpScreenPartner} options={{ headerShown: false}}/>
          <Stack.Screen name="hoteldetail" component={HotelDetailScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="update_profile" component={UpdateProfileScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="admin" component={Dashboard} options={{ headerShown: false}}/>
          <Stack.Screen name="Destination" component={DestinationScreen} options={{ headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

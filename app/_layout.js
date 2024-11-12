// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';


import StartPage from './HomePage';
import Inputs from './(tabs)/inputs';
import LIST from './(tabs)/LIST';
import Updatecpn from './updatecp';
import UserLogin from './login';
import DangKi from './DangKi';
import Homscreen from './(tabs)/home';

import HotelDetailScreen from './hotelDetail';
import UpdateProfileScreen from './updateProfile';
import ProfileScreen from './(tabs)/userProfie';
const Stack = createNativeStackNavigator();

const StackThing= () =>{
  return(
<SafeAreaView style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="startPage">
        <Stack.Screen name="startPage" component={StartPage}  options={{ headerShown: false}} />
          <Stack.Screen name="list" component={LIST} options={{ headerShown: false}}  />
          <Stack.Screen name="ip" component={Inputs} options={{ headerShown: false}} />
          <Stack.Screen name="update" component={Updatecpn} options={{ headerShown: false}} />
          <Stack.Screen name="login" component={UserLogin} options={{ headerShown: false}} />
          <Stack.Screen name="signup" component={DangKi} options={{ headerShown: false}} />
          <Stack.Screen name="home" component={Homscreen} options={{ headerShown: false}} />
         
          <Stack.Screen name="hoteldetail" component={HotelDetailScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="update_profile" component={UpdateProfileScreen} options={{ headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="startPage">
        <Stack.Screen name="startPage" component={StartPage}  options={{ headerShown: false}} />
          <Stack.Screen name="list" component={LIST} options={{ headerShown: false}}  />
          <Stack.Screen name="ip" component={Inputs} options={{ headerShown: false}} />
          <Stack.Screen name="update" component={Updatecpn} options={{ headerShown: false}} />
          <Stack.Screen name="login" component={UserLogin} options={{ headerShown: false}} />
          <Stack.Screen name="signup" component={DangKi} options={{ headerShown: false}} />
          <Stack.Screen name="home" component={Homscreen} options={{ headerShown: false}} />
         
          <Stack.Screen name="hoteldetail" component={HotelDetailScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="update_profile" component={UpdateProfileScreen} options={{ headerShown: false}}/>
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

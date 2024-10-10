// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View } from 'react-native';


import StartPage from './HomePage';
import Inputs from './inputs';
import LIST from './LIST';
import Updatecpn from './updatecp';
import UserLogin from './login';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="home" component={StartPage} />
          <Stack.Screen name="list" component={LIST} />
          <Stack.Screen name="ip" component={Inputs} />
          <Stack.Screen name="update" component={Updatecpn} />
          <Stack.Screen name="login" component={UserLogin} />
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

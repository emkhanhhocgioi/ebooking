import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Tabs, useNavigation } from 'expo-router';
import axios from 'axios';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; // Importing AntDesign icons

import CalendarSelect from './OrderList';
import MainPage from './mainpage';
import ProfileScreen from './userProfie';
import ScheduleScreen from '../scheduleScreen';

import { useColorScheme } from '@/hooks/useColorScheme';
import Orderlist from './OrderList';

export default function Homscreen() {
  const route = useRoute();
  const arr = route.params.username;
  
 
  const colorScheme = useColorScheme();
  const Tab = createBottomTabNavigator();

  const TabsNav = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Explore"
          component={MainPage}
          initialParams={{ username: arr[0] }}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          initialParams={{ username: arr[0] }}
          options={{
            
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="schedule"
          component={ScheduleScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="OrderList"
          component={Orderlist}
          initialParams={{uid: arr[1] }}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="calendar" size={size} color={color} />
            ),
          }}
        />
        
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer independent={true}>
      <TabsNav />
    </NavigationContainer>
  );
}

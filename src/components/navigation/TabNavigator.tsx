import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StackNavigator from "./StackNavigator";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { useAuth } from "../../context/AuthContext";

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="MyRoomTab"
      screenOptions={{
        headerShown: false, // ปิด header ของ Tab Navigator
        tabBarActiveTintColor: colors.gradient_primary, // สีของไอคอนเมื่อแท็บถูกเลือก
        tabBarInactiveTintColor: "gray", // สีของไอคอนเมื่อแท็บไม่ได้ถูกเลือก
        tabBarStyle: {
          backgroundColor: colors.foreground,
        },
      }}
    >
      <Tab.Screen
        name="MyRoomTab"
        component={StackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> // ไอคอนสำหรับแท็บนี้
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> // ไอคอนสำหรับแท็บนี้
          ),
        }}
      />
    </Tab.Navigator>
  );
}

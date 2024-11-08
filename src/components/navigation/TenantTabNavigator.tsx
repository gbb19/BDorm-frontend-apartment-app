import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RoomStackNavigator } from "./RoomStackNavigator";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";
import { BillScreen } from "../../screens/BillScreen";
import { BillStackNavigator } from "./BillStackNavigator";

const Tab = createBottomTabNavigator();

export function TenantTabNavigator() {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={RoomStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> // ไอคอนสำหรับแท็บนี้
          ),
        }}
      />
      <Tab.Screen
        name="Billing"
        component={BillStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

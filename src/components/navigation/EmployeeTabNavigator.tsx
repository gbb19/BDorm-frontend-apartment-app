import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";
import { BillManagerScreen } from "../../screens/BillManagerScreen";

const Tab = createBottomTabNavigator();

export function EmployeeTabNavigator() {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <Tab.Navigator
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
        name="BillManager"
        component={BillManagerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

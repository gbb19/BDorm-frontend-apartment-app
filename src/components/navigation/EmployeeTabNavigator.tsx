import React, {useEffect} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "../../styles/colors";
import {useAuth} from "../../context/AuthContext";
import {BillManagerStackNavigator} from "./BillManagerStackNavigator";
import {RoomManagerStackNavigator} from "./RoomManagerStackNavigator copy";
import {ReservationManagerStackNavigator} from "./ReservationManagerStackNavigator";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {RecordStackNavigator} from "./RecordStackNavigator";

const Tab = createBottomTabNavigator();

export function EmployeeTabNavigator() {
  const {user} = useAuth();

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
      {user?.roles.includes("manager") && (
        <>
          <Tab.Screen
            name="Contracts"
            component={RoomManagerStackNavigator}
            options={{
              tabBarIcon: ({color, size}) => (
                <Ionicons name="document" size={size} color={color}/>
              ),
            }}
          />
          <Tab.Screen
            name="Reservations"
            component={ReservationManagerStackNavigator}
            options={{
              tabBarIcon: ({color, size}) => (
                <Ionicons name="calendar" color={color} size={size}/> // ไอคอนสำหรับแท็บนี้
              ),
            }}
          />
          <Tab.Screen
            name="Billing"
            component={BillManagerStackNavigator}
            options={{
              tabBarIcon: ({color, size}) => (
                <Ionicons name="receipt" size={size} color={color}/>
              ),
            }}
          />
        </>
      )}

      <Tab.Screen
        name="Record"
        component={RecordStackNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="edit-note" size={size} color={color}/>
          ),
        }}
      />


    </Tab.Navigator>
  );
}

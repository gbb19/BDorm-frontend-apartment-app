// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyRoomScreen } from "../../screens/MyRoomScreen";
import { ContractDetailsScreen } from "../../screens/ContractDetailsScreen";
import { colors } from "../../styles/colors";
import { MyReservation } from "../../screens/MyReservation";
import { ReservationDetailsScreen } from "../../screens/ReservationDetailsScreen";
import { BillScreen } from "../../screens/BillScreen";
import { BillDetailsScreen } from "../../screens/BillDetailsScreen";
import { TenantTabNavigator } from "./TenantTabNavigator";
import { ReservationFormScreen } from "../../screens/ReservationFormScreen";

const Stack = createStackNavigator();

export function ReservationStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyReservation"
        component={MyReservation}
        options={{ headerShown: false }} // ซ่อน header สำหรับ MyRoomScreen
      />

      <Stack.Screen
        name="ReservationDetails"
        component={ReservationDetailsScreen}
        options={{
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondary, // เปลี่ยนสีพื้นหลังของ header
          },
          headerTintColor: colors.white, // เปลี่ยนสีของข้อความใน header
          headerTitleStyle: {
            fontWeight: "bold", // ปรับสไตล์ของ title ใน header
          },
        }}
      />

      <Stack.Screen
        name="ReservationForm"
        component={ReservationFormScreen}
        options={{
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondary, // เปลี่ยนสีพื้นหลังของ header
          },
          headerTintColor: colors.white, // เปลี่ยนสีของข้อความใน header
          headerTitleStyle: {
            fontWeight: "bold", // ปรับสไตล์ของ title ใน header
          },
        }}
      />

      <Stack.Screen
        name="Bill"
        component={BillScreen}
        initialParams={{ topbar: false }} // ส่ง props ไปที่ BillScreen
        options={{
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondary, // เปลี่ยนสีพื้นหลังของ header
          },
          headerTintColor: colors.white, // เปลี่ยนสีของข้อความใน header
          headerTitleStyle: {
            fontWeight: "bold", // ปรับสไตล์ของ title ใน header
          },
        }}
      />
      <Stack.Screen
        name="BillDetails"
        component={BillDetailsScreen}
        options={{
          headerShown: true,

          headerStyle: {
            backgroundColor: colors.secondary, // เปลี่ยนสีพื้นหลังของ header
          },
          headerTintColor: colors.white, // เปลี่ยนสีของข้อความใน header
          headerTitleStyle: {
            fontWeight: "bold", // ปรับสไตล์ของ title ใน header
          },
        }}
      />
    </Stack.Navigator>
  );
}

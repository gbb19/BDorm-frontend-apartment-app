// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyRoomScreen } from "../../screens/MyRoomScreen";
import { ContractDetailsScreen } from "../../screens/ContractDetailsScreen";
import { colors } from "../../styles/colors";
import { BillScreen } from "../../screens/BillScreen";
import { BillDetailsScreen } from "../../screens/BillDetailsScreen";

const Stack = createStackNavigator();

export function BillStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Bill">
      <Stack.Screen
        name="Bill"
        component={BillScreen}
        initialParams={{ topbar: true }} // ส่ง props ไปที่ BillScreen
        options={{ headerShown: false }} // ซ่อน header สำหรับ MyRoomScreen
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

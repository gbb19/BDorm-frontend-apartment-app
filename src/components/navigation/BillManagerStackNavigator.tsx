// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyRoomScreen } from "../../screens/MyRoomScreen";
import { ContractDetailsScreen } from "../../screens/ContractDetailsScreen";
import { colors } from "../../styles/colors";
import { BillScreen } from "../../screens/BillScreen";
import { BillDetailsScreen } from "../../screens/BillDetailsScreen";
import { BillManagerScreen } from "../../screens/BillManagerScreen";
import { BillManagerDetailsScreen } from "../../screens/BillManagerDetailsScreen";

const Stack = createStackNavigator();

export function BillManagerStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="BillManager">
      <Stack.Screen
        name="BillManager"
        component={BillManagerScreen}
        options={{ headerShown: false }} // ซ่อน header สำหรับ MyRoomScreen
      />
      <Stack.Screen
        name="BillManagerDetails"
        component={BillManagerDetailsScreen}
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

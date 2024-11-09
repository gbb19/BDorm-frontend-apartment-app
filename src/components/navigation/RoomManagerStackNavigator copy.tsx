// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyRoomScreen } from "../../screens/MyRoomScreen";
import { ContractDetailsScreen } from "../../screens/ContractDetailsScreen";
import { colors } from "../../styles/colors";
import { AllRoomScreen } from "../../screens/AllRoomScreen";
import { CreateContractScreen } from "../../screens/CreateContractScreen";

const Stack = createStackNavigator();

export function RoomManagerStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllRoom"
        component={AllRoomScreen}
        options={{ headerShown: false }} // ซ่อน header สำหรับ MyRoomScreen
      />

      <Stack.Screen
        name="ContractDetail"
        component={ContractDetailsScreen}
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
        name="CreateContract"
        component={CreateContractScreen}
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

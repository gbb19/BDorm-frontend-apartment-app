// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyRoomScreen } from "../../screens/MyRoomScreen";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // ปิด header ของ Tab Navigator
      }}
    >
      <Stack.Screen name="MyRoom" component={MyRoomScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

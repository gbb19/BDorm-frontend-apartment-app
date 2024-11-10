import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {RecordScreen} from "../../screens/RecordScreen";

const Stack = createStackNavigator();

export function RecordStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecordLedger"
        component={RecordScreen}
        options={{ headerShown: false }} // ซ่อน header สำหรับ MyRoomScreen
      />



    </Stack.Navigator>
  );
}

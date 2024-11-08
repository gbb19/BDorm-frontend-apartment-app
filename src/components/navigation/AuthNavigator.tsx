// src/navigation/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../../screens/LoginScreen";
import { RegisterScreen } from "../../screens/RegisterScreen";
import { TenantTabNavigator } from "./TenantTabNavigator";


const Stack = createStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={AuthNavigator}/>
    </Stack.Navigator>
  );
}

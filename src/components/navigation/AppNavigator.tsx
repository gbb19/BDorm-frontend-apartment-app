import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { TenantTabNavigator } from "./TenantTabNavigator";
import { AuthNavigator } from "./AuthNavigator";
import { EmployeeTabNavigator } from "./EmployeeTabNavigator";
import { useAuth } from "../../context/AuthContext";

export function AppNavigator() {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isEmployee = user?.roles?.some((role) =>
    ["accountant", "manager", "cashier"].includes(role)
  );

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        user?.roles?.includes("tenant") ? (
          <TenantTabNavigator />
        ) : isEmployee ? (
          <EmployeeTabNavigator />
        ) : (
          <TenantTabNavigator /> 
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

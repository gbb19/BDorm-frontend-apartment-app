// src/screens/ProfileScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { GradientButton } from "../components/common/GradientButton";

export function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <GradientButton
        title="Logout"
        height={32}
        width={340}
        status="normal"
        onPress={logout}
      />
    </View>
  );
}

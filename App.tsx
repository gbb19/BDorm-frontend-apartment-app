// App.tsx
import React from "react";
import { AppNavigator } from "./src/components/navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}

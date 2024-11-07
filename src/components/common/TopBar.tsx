import React from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { colors } from "../../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";

// ฟังก์ชัน TopBar
export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPress={logout}>
          <Ionicons
            name="person"
            size={24}
            color="white"
            style={{ paddingRight: 16 }} 
          />
        </TouchableOpacity>
        <Text style={styles.usernameText}>{user?.username}</Text>
      </View>
    </>
  );
}

// สไตล์ที่ใช้ในคอมโพเนนต์
const styles = StyleSheet.create({
  topBarContainer: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

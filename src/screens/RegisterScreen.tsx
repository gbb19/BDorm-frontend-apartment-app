import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { colors } from "../styles/colors"; // Import colors
import { GradientLine } from "../components/common/GradientLine";
import { TextField } from "../components/common/TextField";
import { PasswordTextField } from "../components/common/PasswordTextField";
import { GradientButton } from "../components/common/GradientButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { UserService } from "../services/userService";
import { IUserCreate } from "../types/user.types";
import axiosInstance from "../apis/axios";

export function RegisterScreen() {
  // State for the form fields
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  async function registerHandle() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userData: IUserCreate = {
        username,
        first_name: firstName, // เปลี่ยนจาก firstName เป็น first_name
        last_name: lastName, // เปลี่ยนจาก lastName เป็น last_name
        password,
      };

      // เรียกฟังก์ชัน register และส่งข้อมูล userData
      await UserService.register(userData);

      // หากการสมัครสำเร็จ นำผู้ใช้ไปหน้า Login
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "An error occurred during registration"
      );
    }

  }

  function goToLogin() {
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <View />
        <View
          style={{
            width: 350,
            height: 200,
            backgroundColor: colors.primary,
            paddingTop: 90,
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 90, fontWeight: "bold", color: colors.white }}
          >
            BDorm
          </Text>
          <View
            style={{ width: 350, height: 10, backgroundColor: colors.primary }}
          >
            <GradientLine />
          </View>
          <View style={{ width: 350, backgroundColor: colors.primary }}>
            <View style={{ height: 30, backgroundColor: colors.primary }} />
            <TextField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              height={40}
            />
            <TextField
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              height={40}
            />
            <TextField
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              height={40}
            />
            <PasswordTextField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              height={40}
            />
            <PasswordTextField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              height={40}
            />
            <View style={{ height: 20, backgroundColor: colors.primary }} />
            <GradientButton
              title="Register"
              height={32}
              width={340}
              status="normal"
              onPress={registerHandle}
            />
            <View style={{ height: 20, backgroundColor: colors.primary }} />
            <View style={styles.footerContainer}>
              <Text style={styles.text}>Already have an account?</Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.clickText}>Login here.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: 350,
    height: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 15,
    color: colors.white,
  },
  clickText: {
    color: colors.gradient_primary,
    fontWeight: "bold",
  },
});

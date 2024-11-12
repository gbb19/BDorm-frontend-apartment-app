import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../styles/colors";
import { GradientLine } from "../components/common/GradientLine";
import { TextField } from "../components/common/TextField";
import { PasswordTextField } from "../components/common/PasswordTextField";
import { GradientButton } from "../components/common/GradientButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";

import { UserController } from "../controllers/userController";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginScreen() {
  const [usernameFormTextfield, setUsernameFormTextfeild] = useState("");
  const [passwordFormTextfield, setpasswordFormTextfield] = useState("");
  const { setUser, setIsLoggedIn } = useAuth();

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

async function login() {
  try {
    // เรียกใช้ UserController.login() เพื่อเข้าสู่ระบบและรับข้อมูลผู้ใช้
    const user = await UserController.login({ username:usernameFormTextfield, password:passwordFormTextfield });

    // บันทึกข้อมูลผู้ใช้ลงใน AsyncStorage
    await AsyncStorage.setItem("userToken", user.token);
    await AsyncStorage.setItem("username", user.username);
    await AsyncStorage.setItem("firstName", user.firstName);
    await AsyncStorage.setItem("lastName", user.lastName);

    // บันทึก roles เป็น JSON string เพื่อใช้ในภายหลัง
    if (user.roles) {
      await AsyncStorage.setItem("userRole", JSON.stringify(user.roles));
    }

    // ตั้งค่าผู้ใช้ใน AuthContext
    setUser(user);
    setIsLoggedIn(true);

    // นำทางไปหน้า "Home" หลังจากเข้าสู่ระบบสำเร็จ
    navigation.navigate("Home");
  } catch (error) {
    alert("Invalid login");
  }
}




  function goToRegister() {
    navigation.navigate("Register");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BDorm</Text>
          <View style={styles.lineContainer}>
            <GradientLine />
          </View>
          <View style={styles.formContainer}>
            <View style={styles.spacing} />
            <TextField
              placeholder="Username"
              value={usernameFormTextfield}
              onChangeText={setUsernameFormTextfeild}
            />
            <PasswordTextField
              placeholder="Password"
              value={passwordFormTextfield}
              onChangeText={setpasswordFormTextfield}
            />
            <View style={styles.spacing} />
            <GradientButton
              title="Sign in"
              status="normal"
              onPress={login}
            />
            <View style={styles.spacing} />
            <View style={styles.footerContainer}>
              <Text style={styles.text}>You don't have an account?</Text>
              <TouchableOpacity onPress={goToRegister}>
                <Text style={styles.clickText}>Create account.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  centeredContainer: {
    alignItems: "center",
  },
  logoContainer: {
    width: 350,
    height: 250,
    backgroundColor: colors.primary,
    paddingTop: 120,
    alignItems: "center",
  },
  logoText: {
    fontSize: 90,
    fontWeight: "bold",
    color: colors.white,
  },
  lineContainer: {
    width: 350,
    height: 10,
    backgroundColor: colors.primary,
  },
  formContainer: {
    width: 350,
    height: 350,
    backgroundColor: colors.primary,
    alignSelf: "center",
  },
  spacing: {
    height: 20,
    backgroundColor: colors.primary,
  },
  footerContainer: {
    width: 350,
    height: 50,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    color: colors.white,
  },
  clickText: {
    fontSize: 15,
    color: colors.gradient_primary,
    fontWeight: "bold",
  },
});

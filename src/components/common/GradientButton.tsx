import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../styles/colors";

// กำหนดประเภท props
interface GradientButtonProps {
  onPress: (event: GestureResponderEvent) => void; // ฟังก์ชัน onPress ที่รับ event
  title: string; // ชื่อของปุ่ม
  width?: number; // ความกว้างของปุ่ม
  height?: number; // ความสูงของปุ่ม
  status: "reject" | "disable" | "normal"; // สถานะของปุ่ม (ใช้ string literals เพื่อจำกัดค่าที่สามารถใช้ได้)
}

export function GradientButton({
  onPress,
  title,
  width,
  height,
  status,
}: GradientButtonProps) {
  const [state, setState] = useState<string>(status);

  if (state === "reject") {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <LinearGradient
          style={{
            height,
            width,
            padding: 8,
            alignItems: "center",
            borderRadius: 10,
          }}
          colors={[colors.pink, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.textTitle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  } else if (state === "disable") {
    return (
      <LinearGradient
        style={{
          height,
          padding: 8,
          width,
          alignItems: "center",
          borderRadius: 10,
        }}
        colors={[colors.grey, colors.grey]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.textTitle}>{title}</Text>
      </LinearGradient>
    );
  } else {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <LinearGradient
          style={{
            height,
            padding: 8,
            width,
            alignItems: "center",
            borderRadius: 10,
          }}
          colors={[colors.gradient_primary, colors.gradient_secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.textTitle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {},
  textTitle: {
    fontSize: 20,
    color: colors.white,
    alignItems: "center",
  },
});

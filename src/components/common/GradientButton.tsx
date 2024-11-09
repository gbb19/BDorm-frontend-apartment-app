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
  status: "cancel" | "reject" | "normal" | "approve"; // สถานะของปุ่ม (ใช้ string literals เพื่อจำกัดค่าที่สามารถใช้ได้)
  fontSize?: number;
}

export function GradientButton({
  onPress,
  title,
  width,
  height,
  status,
  fontSize = 20,
}: GradientButtonProps) {
  const [state, setState] = useState<string>(status);

  const textStyle = {
    fontSize, 
    color: colors.white,
  };

  if (state === "cancel") {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          style={{
            height,
            width,
            padding: 8,
            alignItems: "center",
            borderRadius: 10,
          }}
          colors={[colors.pink, colors.gradient_secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  } else if (state === "reject") {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          style={{
            height,
            width,
            padding: 8,
            alignItems: "center",
            borderRadius: 10,
          }}
          colors={[colors.red, colors.reject]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  } else if (state === "approve") {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          style={{
            height,
            width,
            padding: 8,
            alignItems: "center",
            borderRadius: 10,
          }}
          colors={[colors.paid, colors.approve]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress}>
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
          <Text style={textStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

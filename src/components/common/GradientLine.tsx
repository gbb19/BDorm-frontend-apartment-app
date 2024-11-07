import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../styles/colors";

// กำหนดประเภทของ props ที่ใช้ในคอมโพเนนต์
interface GradientLineProps {
  // คุณสามารถเพิ่ม props ที่จำเป็นได้ที่นี่
}

export function GradientLine({}: GradientLineProps) {
  return (
    <View>
      <LinearGradient
        colors={[colors.gradient_primary, colors.gradient_secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientLine: {
    height: 2,
    borderRadius: 1,
  } 
});


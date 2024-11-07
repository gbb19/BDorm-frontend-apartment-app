import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

// กำหนดประเภทของ props
interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string; // ใช้ ? ถ้า prop นี้ไม่จำเป็นต้องมี
  width?: number;
  height?: number;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  width,
  height,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      mode="outlined"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        margin: 10,
        backgroundColor: colors.white,
        width: width,
        height: height,
      }}
      theme={{
        colors: {
          primary: isFocused ? colors.gradient_secondary : "white",
          text: "#302C39", // กำหนดสีข้อความในที่นี้
        },
      }}
      outlineColor="white"
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
    backgroundColor: colors.white,
  },
});


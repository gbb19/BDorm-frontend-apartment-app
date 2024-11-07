import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors'; // ตรวจสอบให้แน่ใจว่า `colors` ถูกต้อง

interface PasswordTextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  width?: number;
  height?: number;
}

export function PasswordTextField ({
  label,
  value,
  onChangeText,
  placeholder,
  width,
  height,
}: PasswordTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry
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
          primary: isFocused ? colors.gradient_secondary : 'white',
          text: "#302C39", // สีข้อความถูกกำหนดใน theme.colors.text
        },
      }}
      outlineColor="white"
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
    backgroundColor: colors.white,
  },
});


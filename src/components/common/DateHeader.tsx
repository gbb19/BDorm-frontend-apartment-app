import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../../styles/colors";
import { GradientLine } from "./GradientLine";

// ประกาศประเภท props ของ DateHeader
interface DateHeaderProps {
  date: string; // date เป็น string ที่มีรูปแบบ 'DD/MM/YYYY'
}

export function DateHeader({ date }: DateHeaderProps) {
  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{date}</Text>
      <GradientLine />
    </View>
  );
}

// ฟังก์ชันที่แปลง dateStr เป็น format ที่ต้องการ

const styles = StyleSheet.create({
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 8,
  },
  gradientLine: {
    height: 2,
    borderRadius: 1,
  },
});

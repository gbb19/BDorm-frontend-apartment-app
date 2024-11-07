import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../styles/colors";

// Define the props type for the component
interface RoomCardProps {
  room: number;
  onClick: () => void;
}

export function RoomCard({ room,onClick }: RoomCardProps) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.roomText}>Room-{room}</Text>
            <Text style={styles.floorText}>Floor {room % 100}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  } as ViewStyle, // Type for View style
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle, // Type for View style
  roomText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  } as TextStyle, // Type for Text style
  floorText: {
    color: colors.lightGrey,
    fontSize: 14,
    marginTop: 4,
  } as TextStyle, // Type for Text style
});

export default RoomCard;

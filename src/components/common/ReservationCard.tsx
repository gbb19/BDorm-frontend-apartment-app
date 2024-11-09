import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/colors";

interface ReservationCardProps {
  reservation_id: number;
  reservation_room_number: number;
  onPress: (event: GestureResponderEvent) => void;
  status: number;
}

export function ReservationCard({
  reservation_id,
  reservation_room_number,
  onPress,
  status,
}: ReservationCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.reservationText}>
            Reservation-{reservation_id}
          </Text>
          <Text style={styles.floorText}>Room: {reservation_room_number}</Text>
          <Text style={styles.floorText}>
            Floor {Math.floor(reservation_room_number / 100)}
          </Text>
        </View>
        <Text
          style={[
            styles.statusText,
            {
              color:
                status == 0
                  ? colors.created
                  : status == 1
                  ? colors.approve
                  : status == 2
                  ? colors.reject
                  : status == 3
                  ? colors.paid
                  : status == 4
                  ? colors.verified
                  : colors.grey,
            },
          ]}
        >
          {getStatusText(status)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
const getStatusText = (billStatus: number) => {
  switch (billStatus) {
    case 0:
      return "Created";
    case 1:
      return "Approved";
    case 2:
      return "Cancelled";
    case 3:
      return "Paid";
    case 4:
      return "Verified";
    default:
      return "Unknown";
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reservationText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  floorText: {
    color: colors.lightGrey,
    fontSize: 14,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
});

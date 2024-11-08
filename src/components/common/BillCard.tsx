import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/colors";

interface BillCardProps {
  bill_id: number;
  onPress: (event: GestureResponderEvent) => void;
  status: number;
}

export function BillCard({ bill_id, onPress, status }: BillCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.roomText}>Bill-{bill_id}</Text>
        </View>
        <Text
          style={[
            styles.statusText,
            {
              color:
                status == 0
                  ? colors.created
                  : status == 1
                  ? colors.paid
                  : status == 2
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
const getStatusText = (billStatus:number) => {
  switch (billStatus) {
    case 0:
      return 'Created';
    case 1:
      return 'Paid';
    case 2:
      return 'Verified';
    default:
      return 'Unknown';
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
  roomText: {
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

import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../components/common/TopBar";
import { colors } from "../styles/colors";
import { ScrollView } from "react-native";
import { GradientLine } from "../components/common/GradientLine";
import { useAuth } from "../context/AuthContext";
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { Reservation } from "../models/Reservation";
import { ReservationService } from "../services/reservationService";
import { ReservationCard } from "../components/common/ReservationCard";
import { ENDPOINTS } from "../apis/endpoints";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientButton } from "../components/common/GradientButton";

export function AllReservation() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [])
  );

  function handleToDetails(reservation: Reservation) {
    navigation.navigate("ReservationDetails", {
      reservation,
    });
  }

  function handleToReservationForm() {
    navigation.navigate("ReservationForm", {});
  }
  async function fetchReservations() {
    setLoading(true);
    try {
      const data = await ReservationService.getAllReservations(user?.token!);
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <View style={styles.row}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            All Reservation
          </Text>
        </View>
        <GradientLine />
        <View style={styles.cardList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            reservations.map((reservation, index) => (
              <ReservationCard
                key={reservation.reservationID}
                reservation_id={reservation.reservationID}
                reservation_room_number={reservation.reservationRoomNumber}
                status={reservation.reservationStatus}
                onPress={() => {
                  handleToDetails(reservation);
                }}
              /> // สร้าง RoomCard สำหรับแต่ละ contract
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardList: {
    paddingTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
});

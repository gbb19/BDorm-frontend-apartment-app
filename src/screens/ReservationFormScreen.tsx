import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../styles/colors";
import { useAuth } from "../context/AuthContext";
import { IReservationCreate } from "../types/reservation.types";
import { ReservationController } from "../controllers/reservationController";
import { GradientButton } from "../components/common/GradientButton";

export function ReservationFormScreen() {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");

  // Form state
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [moveInDate, setMoveInDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เพราะ getMonth() จะคืนค่าเดือนจาก 0 ถึง 11
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setMoveInDate(date);
    hideDatePicker();
  };

  const handleCreateReservation = async () => {
    if (!roomNumber) {
      Alert.alert("Error", "Please enter room number");
      return;
    }

    try {
      const reservationData: IReservationCreate = {
        move_in_date_time: formatDateTime(moveInDate),
        reservation_room_number: parseInt(roomNumber),
        tenant_username: user?.username!,
      };

      await ReservationController.createReservation(reservationData, user?.token!);
      Alert.alert("Success", "Reservation created successfully");

      // Reset form
      setRoomNumber("");
      setMoveInDate(new Date());
    } catch (err) {
      Alert.alert("Error", "Failed to create reservation");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Reservation</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Number</Text>
              <TextInput
                style={styles.input}
                value={roomNumber}
                onChangeText={setRoomNumber}
                keyboardType="numeric"
                placeholder="Enter room number"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Move-in Date and Time</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showDatePicker}
              >
                <Text style={styles.dateButtonText}>
                  {moveInDate.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
                date={moveInDate}
              />
            </View>

            <GradientButton
              title="Create Reservation"
              status="normal"
              onPress={handleCreateReservation}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

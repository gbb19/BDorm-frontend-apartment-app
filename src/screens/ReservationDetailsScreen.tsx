import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { Reservation } from "../models/Reservation";
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { GradientButton } from "../components/common/GradientButton";
import { GradientLine } from "../components/common/GradientLine";
import { StackNavigationProp } from "@react-navigation/stack";
import { ReservationController } from "../controllers/reservationController";
import {
  IReservationUpdate,
  IUpdateReservationDetails,
} from "../types/reservation.types";
import { BillController } from "../controllers/billController";
import { UserController } from "../controllers/userController";
import { IUserDetails } from "../types/user.types";

type ReservationStackNavigatorParamList = {
  ReservationDetails: {
    reservation: Reservation;
  };
};

type ReservationDetailsScreenRouteProp = RouteProp<
  ReservationStackNavigatorParamList,
  "ReservationDetails"
>;

export function ReservationDetailsScreen() {
  const { user } = useAuth();
  const route = useRoute<ReservationDetailsScreenRouteProp>();
  const { reservation } = route.params;
  const [reservationDetails, setReservationDetails] =
    useState<Reservation | null>(null);
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchReservationDetails();
      fetchUserDetails();
    }, [])
  );

  function handleToBilling() {
    if (user?.roles.includes("tenant")) {
      navigation.navigate("Bill");
    } else {
      navigation.navigate("BillManager");
    }
  }

  async function fetchReservationDetails() {
    setLoading(true);
    try {
      const data = await ReservationController.getReservationByID(
        reservation.reservationID,
        user?.token!
      );

      setReservationDetails(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reservation details");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetails() {
    setLoading(true);
    try {
      const data = await UserController.getUserDetails(
        reservation.tenantUsername,
        user?.token!
      );
      setUserDetails(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
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

  const getTextStyle = (billStatus: number) => {
    switch (billStatus) {
      case 0:
        return styles.created;
      case 1:
        return styles.approved;
      case 2:
        return styles.cancelled;
      case 3:
        return styles.paid;
      case 4:
        return styles.verified;
      default:
        return styles.normal;
    }
  };

  async function updateReservationStatus(status: number) {
    try {
      const updateData: IReservationUpdate = {
        reservation_id: reservation.reservationID,
        reservation_status: status,
      };

      await ReservationController.updateReservationStatus(
        updateData,
        user?.token!
      );
      if (status == 1) {
        const billResponse = await BillController.createBill(
          -1,
          reservationDetails?.tenantUsername!,
          user?.username!,
          user?.token!
        );

        await BillController.createBillItem(
          billResponse.bill_id,
          1,
          "ค่ามัดจำ",
          1,
          3000,
          user?.token!
        );

        const updateReservationDetails: IUpdateReservationDetails = {
          reservation_id: reservationDetails?.reservationID!,
          bill_id: billResponse.bill_id,
          manager_username: user?.username!,
        };
        await ReservationController.updateReservationDetails(
          updateReservationDetails,
          user?.token!
        );
      }
      fetchReservationDetails();
    } catch (err) {
      console.error(err);
      setError("Failed to update reservation details");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.title}>
              Reservation: {reservationDetails?.reservationID}
            </Text>
            <Text style={getTextStyle(reservationDetails?.reservationStatus!)}>
              {getStatusText(reservationDetails?.reservationStatus!)}
            </Text>
          </View>
          <GradientLine />
          <View style={styles.boxContent}>
            <View style={styles.line}>
              <Text style={styles.subTitle}>Name:</Text>
              <View style={{ width: 8 }}></View>
              <Text style={styles.info}>
                {userDetails?.first_name} {userDetails?.last_name}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.subTitle}>Username:</Text>
              <View style={{ width: 8 }}></View>
              <Text style={styles.info}>
                {reservationDetails?.tenantUsername}
              </Text>
            </View>

            <View style={styles.line}>
              <Text style={styles.subTitle}>Available Date:</Text>
              <View style={{ width: 8 }}></View>
              <Text style={styles.info}>
                {reservationDetails?.moveInDateTime}
              </Text>
            </View>

            {reservationDetails?.billID !== undefined &&
              reservationDetails?.reservationStatus == 1 && (
                <View>
                  <View style={styles.line}>
                    <Text style={styles.subTitle}>Bill:</Text>
                    <View style={{ width: 8 }}></View>
                    <Text style={styles.info}>
                      {reservationDetails!.billID}
                    </Text>
                  </View>
                  <View style={{ height: 16 }}></View>
                  <GradientLine />
                  <View style={{ height: 16 }}></View>
                  <GradientButton
                    title="Go Bill"
                    status="normal"
                    onPress={() => {
                      handleToBilling();
                    }}
                  />
                </View>
              )}

            {user?.roles.includes("manager") &&
              reservationDetails?.reservationStatus == 0 &&
              reservationDetails?.reservationStatus == 0 && (
                <View>
                  <View style={{ height: 16 }}></View>
                  <View style={styles.rowButton}>
                    <GradientButton
                      title="Cancel"
                      status="cancel"
                      width={100}
                      onPress={() => {
                        updateReservationStatus(2);
                      }}
                    />
                    <GradientButton
                      title="Approve"
                      status="approve"
                      width={100}
                      onPress={() => {
                        updateReservationStatus(1);
                      }}
                    />
                  </View>
                </View>
              )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: 18,
    color: colors.white,
  },
  line: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  boxContent: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: colors.tertiary,
  },
  paid: {
    color: colors.paid,
    fontSize: 16,
  },
  normal: {
    color: colors.grey,
    fontSize: 16,
  },
  created: {
    color: colors.grey,
    fontSize: 16,
  },
  cancelled: {
    color: colors.reject,
    fontSize: 16,
  },
  approved: {
    color: colors.approve,
    fontSize: 16,
  },
  verified: {
    color: colors.verified,
    fontSize: 16,
  },
  rowButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.white,
  },
  timestamp: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
});

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../components/common/TopBar";
import { colors } from "../styles/colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BillItem } from "../models/BillItem";
import { BillService } from "../services/billService";
import { useAuth } from "../context/AuthContext";
import { GradientButton } from "../components/common/GradientButton";

type BillId = {
  billID: number;
};

type BillStackNavigatorParamList = {
  BillDetails: {
    billID: number;
  };
};

type BillDetailsScreenRouteProp = RouteProp<
  BillStackNavigatorParamList,
  "BillDetails"
>;

export function BillDetailsScreen() {
  const { user } = useAuth();
  const route = useRoute<BillDetailsScreenRouteProp>();
  const { billID } = route.params;

  const [loading, setLoading] = useState(true);
  const [billItems, setBillItems] = useState<BillItem[] | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!billItems) {
      fetchBillItems();
    }
  }, [billItems]);

  async function fetchBillItems() {
    setLoading(true);
    try {
      const billItems = await BillService.getBillItemsByBillID(
        billID,
        user?.token!
      );

      setBillItems(billItems);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bill items");
    } finally {
      setLoading(false);
    }
  }

  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
});

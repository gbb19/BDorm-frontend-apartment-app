import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BillItemTable } from "../components/common/BillItemTable";
import { BillItem } from "../models/BillItem";
import { BillService } from "../services/billService";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Bill } from "../models/Bill";
import { GradientLine } from "../components/common/GradientLine";
import { GradientButton } from "../components/common/GradientButton";
import * as ImagePicker from "expo-image-picker";
import { PaymentUpload } from "../components/common/PaymentUpload";

type BillStackNavigatorParamList = {
  BillDetails: {
    bill: Bill;
  };
};

type BillDetailsScreenRouteProp = RouteProp<
  BillStackNavigatorParamList,
  "BillDetails"
>;

export function BillDetailsScreen() {
  const { user } = useAuth();
  const route = useRoute<BillDetailsScreenRouteProp>();
  const { bill } = route.params;

  const [loading, setLoading] = useState(true);
  const [billItems, setBillItems] = useState<BillItem[] | null>(null);
  const [error, setError] = useState("");

  const [transactions, setTransactions] = useState([]);

  const [modalQrVisible, setModalQrVisible] = useState(false);
  const [step, setStep] = useState(1); // step 1 = QR Code, step 2 = Upload Form

  const [selectedFiles, setSelectedFiles] = useState([]); // ไฟล์ที่ถูก confirm แล้ว
  const [tempSelectedFiles, setTempSelectedFiles] = useState([]); // ไฟล์ที่เลือกชั่วคราว

  const [modalTransactionFile, setModalTransactionFile] = useState(false);

  const [modalTransaction, setModalTransaction] = useState(false);

  useEffect(() => {
    if (!billItems) {
      fetchBillItems();
    }
  }, [billItems]);

  async function fetchBillItems() {
    setLoading(true);
    try {
      const billItems = await BillService.getBillItemsByBillID(
        bill.billID,
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



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>Bill: {bill.billID}</Text>
          <Text style={styles.timestamp}>{bill.createDateTime}</Text>
        </View>
        <GradientLine />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          billItems && <BillItemTable billItems={billItems} />
        )}

        <View>
          <PaymentUpload
            qrCodeImage={require("../../assets/qr-code.png")}
            token={user?.token!}
            billID={bill.billID}
          />
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
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  loadingText: {
    color: colors.white,
    textAlign: "center",
    marginVertical: 10,
  },
});

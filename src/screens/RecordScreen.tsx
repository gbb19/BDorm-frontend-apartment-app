import React, {useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {TopBar} from "../components/common/TopBar";
import {colors} from "../styles/colors";
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {GradientLine} from "../components/common/GradientLine";
import {LedgerItem} from "../models/LedgerItem";
import {useAuth} from "../context/AuthContext";
import {RecordCard} from "../components/common/RecordCard";
import {LedgerController} from "../controllers/LedgerController";
import {BillController} from "../controllers/billController";
import {GradientButton} from "../components/common/GradientButton";


const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


export function RecordScreen() {
  const {user} = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2024);
  const [ledgerItems, setLedgerItems] = useState<LedgerItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchLedgerItem();
  }, [selectedMonth, selectedYear]);

  async function fetchLedgerItem() {
    setLoading(true);
    try {
      const data = await LedgerController.getLedgerItemsByMonthAndYear(selectedMonth + 1, selectedYear, user?.token!)
      setLedgerItems(data)
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ledgerItem");
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateLedger() {
    try {
      await LedgerController.createLedger(selectedMonth + 1, selectedYear, user?.username!, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 101, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 102, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 103, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 104, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 105, 0, 0, user?.token!)


      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 201, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 202, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 203, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 204, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 205, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 206, 0, 0, user?.token!)


      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 301, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 302, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 303, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 304, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 305, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 306, 0, 0, user?.token!)


      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 401, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 402, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 403, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 404, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 405, 0, 0, user?.token!)
      await LedgerController.createLedgerItem(selectedMonth + 1, selectedYear, 406, 0, 0, user?.token!)

      fetchLedgerItem()
    } catch (err) {
      console.error(err);
    }
  }

  function MonthYearSelector() {
    return (
      <View style={styles.card}>
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => {
              if (!loading) { // ตรวจสอบสถานะ loading
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(prev => prev - 1);
                } else {
                  setSelectedMonth(prev => prev - 1);
                }
              }
            }}
            disabled={loading} // ปิดการใช้งานปุ่มเมื่อกำลังโหลด
          >
            <Ionicons name="arrow-back" size={24} color="white"/>
          </TouchableOpacity>

          <Text style={styles.monthYearText}>
            {MONTHS[selectedMonth]} {selectedYear}
          </Text>

          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => {
              if (!loading) { // ตรวจสอบสถานะ loading
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(prev => prev + 1);
                } else {
                  setSelectedMonth(prev => prev + 1);
                }
              }
            }}
            disabled={loading} // ปิดการใช้งานปุ่มเมื่อกำลังโหลด
          >
            <Ionicons name="arrow-forward" size={24} color="white"/>
          </TouchableOpacity>
        </View>

        {((user?.roles.includes("accountant") || user?.roles.includes("manager")) && ledgerItems?.length == 0) && (
          <View style={{marginTop: 16}}>
            <GradientLine/>
            <View style={styles.createNextMonth}>
              <View>
                <Text style={styles.subtitle}>Build a Ledger this month</Text>
              </View>
              <TouchableOpacity
                onPress={() => {handleCreateLedger()}}
              >
                <LinearGradient
                  style={styles.createLedgerButton}
                  colors={[colors.pink, colors.gradient_secondary]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <Ionicons name="play-circle" size={20} color="white"/>
                  <Text style={styles.buttonText}>Create All Ledger</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}


      </View>
    );
  }

  const handleUpdate = async (updatedItem: LedgerItem) => {
    try {
      await LedgerController.updateLedgerItem(updatedItem.ledgerMonth, updatedItem.ledgerYear, updatedItem.ledgerItemRoomNumber, updatedItem.waterUnit, updatedItem.electricityUnit, user?.token!)
      fetchLedgerItem()
    } catch (error) {
      throw error;
    }
  };

  const handleIssue = async (item: LedgerItem) => {
    try {
      await LedgerController.updateLedgerItemStatus(item.ledgerMonth, item.ledgerYear, item.ledgerItemRoomNumber, user?.token!)
      const billResponse = await BillController.createBill(5, item.contract.username, user?.username!, user?.token!)


      await BillController.createBillItem(
        billResponse.bill_id,
        1,
        "ค่าน้ำ",
        item.waterUnit,
        item.contract.water_rate,
        user?.token!
      );

      await BillController.createBillItem(
        billResponse.bill_id,
        2,
        "ค่าไฟ",
        item.electricityUnit,
        item.contract.electricity_rate,
        user?.token!
      );

      await BillController.createBillItem(
        billResponse.bill_id,
        3,
        "ค่าห้อง",
        1,
        item.contract.rental_price,
        user?.token!
      );

      await BillController.createBillItem(
        billResponse.bill_id,
        4,
        "ค่าอินเตอร์เน็ต",
        1,
        item.contract.internet_service_fee,
        user?.token!
      );

      fetchLedgerItem()
    } catch (error) {
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar/>
      <ScrollView style={styles.content}>
        <MonthYearSelector/>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large"/>
          </View>
        ) : (

          ledgerItems?.map((ledgerItem, index) => (
            <RecordCard key={ledgerItem.ledgerItemRoomNumber} ledgerItem={ledgerItem} user={user!} onIssue={handleIssue}
                        onUpdate={handleUpdate}/>
          ))

        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
    marginBottom: 16
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white
  },
  createNextMonth: {
    marginTop: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#878787',
  },
  smallText: {
    fontSize: 12,
    color: '#6B7280',
  },
  createLedgerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

});

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../components/common/TopBar";
import { colors } from "../styles/colors";
import { BillCard } from "../components/common/BillCard";
import { SearchBar } from "../components/common/SearchBar";
import { Bill } from "../models/Bill";
import { useAuth } from "../context/AuthContext";
import { BillService } from "../services/billService";
import { FlatList } from "react-native";
import { DateHeader } from "../components/common/DateHeader";
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface BillsByDate {
  date: string;
  bills: Bill[];
}

interface BillManagerScreenProps {
  route: any; // รับ route props
}

export function BillManagerScreen({ route }: BillManagerScreenProps) {
  const { user } = useAuth();
  const { topbar } = route.params; // ดึง topbar จาก params
  const [allBillsByDate, setAllBillsByDate] = useState<BillsByDate[] | null>(
    null
  );
  const [filteredBillsByDate, setFilteredBillsByDate] = useState<
    BillsByDate[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useFocusEffect(
    React.useCallback(() => {
      fetchBills();
    }, [])
  );

  async function fetchBills() {
    setLoading(true);
    try {
      const bills = await BillService.getAllBills(user?.token!);
      const groupedBills = groupBillsByDate(bills);
      setAllBillsByDate(groupedBills);
      setFilteredBillsByDate(groupedBills);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  }

  function groupBillsByDate(bills: Bill[]): BillsByDate[] {
    const billsByDate: { [date: string]: Bill[] } = {};
    bills.forEach((bill) => {
      const date = bill.createDateTime.split(" ")[0];
      if (!billsByDate[date]) {
        billsByDate[date] = [];
      }
      billsByDate[date].push(bill);
    });
    return Object.entries(billsByDate).map(([date, bills]) => ({
      date,
      bills,
    }));
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBillsByDate(allBillsByDate);
    } else {
      const filteredBills = allBillsByDate?.filter((billGroup) => {
        return billGroup.bills.some((bill) =>
          `Bill-${bill.billID}`.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredBillsByDate(filteredBills ?? null);
    }
  }

  function handleToDetails(bill: Bill) {
    navigation.navigate("BillManagerDetails", { bill });
  }

  return (
    <SafeAreaView style={styles.container}>
      {topbar && <TopBar />}
      <SearchBar
        placeholder="Search bills..."
        onSearch={handleSearch}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading && (
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      )}
      {error && (
        <View style={styles.content}>
          <Text>Error: {error}</Text>
        </View>
      )}

      {filteredBillsByDate && (
        <FlatList
          style={styles.content}
          data={filteredBillsByDate}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <>
              <DateHeader date={item.date} />
              {item.bills.map((bill) => (
                <BillCard
                  key={bill.billID}
                  bill_id={bill.billID}
                  status={bill.billStatus}
                  onPress={() => handleToDetails(bill)}
                />
              ))}
            </>
          )}
        />
      )}
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
});

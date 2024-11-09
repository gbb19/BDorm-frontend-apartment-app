import React, { useEffect, useState } from "react";
import { TopBar } from "../components/common/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { colors } from "../styles/colors";
import { GradientLine } from "../components/common/GradientLine";
import { ContractService } from "../services/contractService";
import RoomCard from "../components/common/RoomCard";
import { ContractResponse } from "../models/ContractResponse";
import { ParamListBase, useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientButton } from "../components/common/GradientButton";

export function AllRoomScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();


  useFocusEffect(
    React.useCallback(() => {
      fetchRooms(user?.username!);
    }, [])
  );
  function handelShowContractDetail(contractResponse: ContractResponse) {
    navigation.navigate("ContractDetail", { contractResponse });
  }

  function handelCreateContract() {
    navigation.navigate("CreateContract");
  }

  async function fetchRooms(username: string) {
    setLoading(true);
    try {
      const data = await ContractService.getAllContracts(user?.token!);
      setContracts(data);
    } catch (err) {
      console.error(err);
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
            All Room
          </Text>
          <GradientButton
            title="Create Contract"
            status="normal"
            fontSize={14}
            onPress={() => {
              handelCreateContract();
            }}
          />
        </View>
        <GradientLine />

        <View style={styles.cardList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            contracts.map((contractResponse, index) => (
              <RoomCard
                key={contractResponse.contractRoomNumber}
                room={contractResponse.contractRoomNumber}
                onClick={() => {
                  handelShowContractDetail(contractResponse);
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
  cardList: {
    paddingTop: 16,
  },
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
  },
});

import React, { useEffect, useState } from "react";
import { TopBar } from "../components/common/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { colors } from "../styles/colors";
import { GradientLine } from "../components/common/GradientLine";
import { GradientButton } from "../components/common/GradientButton";
import { ContractController } from "../controllers/contractController";
import RoomCard from "../components/common/RoomCard";
import { IContractRoomResponse } from "../types/contract.types";
import { ContractResponse } from "../models/ContractResponse";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export function MyRoomScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    fetchRooms(user?.username!);
  }, []);

  function handelShowContractDetail(contractResponse: ContractResponse) {
    navigation.navigate("ContractDetail", { contractResponse });
  }

  async function fetchRooms(username: string) {
    setLoading(true);
    try {
      const data = await ContractController.getAllContractByUsername(
        username,
        user?.token!
      );
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
        <Text
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          My Rooms
        </Text>
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

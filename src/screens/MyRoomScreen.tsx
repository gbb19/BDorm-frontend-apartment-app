import React, { useEffect, useState } from "react";
import { TopBar } from "../components/common/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { colors } from "../styles/colors";
import { GradientLine } from "../components/common/GradientLine";
import { GradientButton } from "../components/common/GradientButton";
import { ContractService } from "../services/contractService";
import RoomCard from "../components/common/RoomCard";

export function MyRoomScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<number[]>([]);

  useEffect(() => {
    if (contracts) {
      fetchRooms("tenant1");
    }
  }, [contracts]);

  function handelShowRoom() {}

  async function fetchRooms(username: string) {
    setLoading(true);
    try {
      const data = await ContractService.getAllContractByUsername(
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
          {!loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            contracts.map((contract, index) => (
              <RoomCard
                key={index}
                room={contract}
                onClick={() => {
                  console.log("hello");
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

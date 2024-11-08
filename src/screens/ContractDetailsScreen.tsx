import React, { useEffect, useState } from "react";
import { ContractResponse } from "../models/ContractResponse";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ContractDetail } from "../models/ContractDetail";
import { ContractService } from "../services/contractService";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/colors";
import { GradientLine } from "../components/common/GradientLine";

type Contract = {
  contractResponse: ContractResponse;
};

type RoomNavigatorParamList = {
  ContractDetails: {
    contractResponse: ContractResponse;
  };
};

// กำหนดประเภทของ route props ที่จะใช้ใน ContractDetailScreen
type ContractDetailsScreenRouteProp = RouteProp<
  RoomNavigatorParamList,
  "ContractDetails"
>;

export function ContractDetailsScreen() {
  const { user } = useAuth();
  const route = useRoute<ContractDetailsScreenRouteProp>();
  const { contractResponse } = route.params;
  const [contractDetail, setContractDetail] = useState<ContractDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractDetail) {
      fetchContractDetails();
    }
  }, [contractDetail]);

  async function fetchContractDetails() {
    setLoading(true);
    try {
      const data = await ContractService.getContractDetails(
        contractResponse.contractNumber,
        contractResponse.contractYear,
        user?.token!
      );
      setContractDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 30, fontWeight: "bold", color: colors.white }}
            >
              Room-{contractResponse.contractRoomNumber}
            </Text>
          </View>
          <View style={{ height: 10 }}></View>
          <GradientLine />
          <View style={{ height: 20 }}></View>

          <View style={styles.contentBox}>
            <Text style={styles.header}>Rental Price</Text>
            <View style={styles.textBox}>
              <View style={{ width: 15 }}></View>
              <Text style={styles.detail}>
                {contractDetail?.rentalPrice} Bath.
              </Text>
            </View>

            <Text style={styles.header}>Contract Year</Text>
            <View style={styles.textBox}>
              <View style={{ width: 15 }}></View>
              <Text style={styles.detail}>{contractDetail?.contractYear}</Text>
            </View>

            <Text style={styles.header}>Expense rate detail</Text>

            <View style={styles.textBox}>
              <View
                style={{ width: 15, justifyContent: "space-evenly" }}
              ></View>
              <Text style={styles.detail}>
                Water Rate : {contractDetail?.waterRate}
              </Text>
            </View>
            <View style={styles.textBox}>
              <View
                style={{ width: 15, justifyContent: "space-evenly" }}
              ></View>
              <Text style={styles.detail}>
                Electricity Rate : {contractDetail?.electricityRate}
              </Text>
            </View>
            <View style={styles.textBox}>
              <View
                style={{ width: 15, justifyContent: "space-evenly" }}
              ></View>
              <Text style={styles.detail}>
                Internet Service fee : {contractDetail?.internetFee}
              </Text>
            </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  userInitial: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  contentBox: {
    flex: 1,
    backgroundColor: colors.tertiary,
    height: 350,
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 12,
    borderRadius: 20,
    // paddingLeft:30
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.white,
  },
  detail: {
    fontSize: 20,
    color: colors.white,
  },
  textBox: {
    flexDirection: "row",
  },
  paid: {
    color: colors.primary,
    fontSize: 30,
  },
  created: {
    color: colors.grey,
    fontSize: 30,
  },
  canceled: {
    color: colors.error,
    fontSize: 30,
  },
  approve: {
    color: colors.paid,
    fontSize: 30,
  },
  verified: {
    color: colors.secondary,
    fontSize: 30,
  },
});

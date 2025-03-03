import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { BillItemTable } from "../components/common/BillItemTable";
import { BillItem } from "../models/BillItem";
import { BillController } from "../controllers/billController";
import { useAuth } from "../context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import { Bill } from "../models/Bill";
import { GradientLine } from "../components/common/GradientLine";
import { GradientButton } from "../components/common/GradientButton";
import { TransactionCard } from "../components/common/TransactionCard";
import { getImagesFromGithub } from "../controllers/githubController";
import { Transaction } from "../models/Transaction";
import { TransactionImage } from "../types/transaction.types";
import { PaymentUpload } from "../components/common/PaymentUpload";
import { MaterialIcons } from "@expo/vector-icons";

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

const windowWidth = Dimensions.get("window").width;
const imageWidth = (windowWidth - 48) / 2;

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

  const [loadingBill, setLoadingBill] = useState(true);
  const [billItems, setBillItems] = useState<BillItem[] | null>(null);
  const [error, setError] = useState("");

  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [modalTransactionFile, setModalTransactionFile] = useState(false);

  const [images, setImages] = useState<TransactionImage[]>([]);
  const [loadingImage, setLoadingImage] = useState(true);

  const [selectedImage, setSelectedImage] = useState<TransactionImage | null>(
    null
  );

  useEffect(() => {
    if (!billItems) {
      fetchBillItems();
    }
    if (!transactions) {
      fetchTransactions();
    }
  }, [billItems, transactions]);

  useEffect(() => {
    if (selectedTransaction) {
      fetchImages();
    }
  }, [selectedTransaction]);

  async function fetchImages() {
    try {
      setLoadingImage(true);
      const fetchedImages = await getImagesFromGithub(
        selectedTransaction?.transactionID.toString()!
      );
      setImages(fetchedImages);
    } catch (err) {
      setError("Failed to load images");
      console.error("Error fetching images:", err);
    } finally {
      setLoadingImage(false);
    }
  }

  async function fetchTransactions() {
    setLoadingTransaction(true);
    try {
      const transactions = await BillController.getTransactionsByBillID(
        bill.billID,
        user?.token!
      );
      setTransactions(transactions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transaction");
    } finally {
      setLoadingTransaction(false);
    }
  }

  async function fetchBillItems() {
    setLoadingBill(true);
    try {
      const billItems = await BillController.getBillItemsByBillID(
        bill.billID,
        user?.token!
      );
      setBillItems(billItems);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bill items");
    } finally {
      setLoadingBill(false);
    }
  }

  async function onTransactionFileButtonClick(transaction: Transaction) {
    setSelectedTransaction(transaction); // ตั้งค่าข้อมูล transaction ที่เลือก
    setModalTransactionFile(true); // เปิด modal
  }

  function onTransactionFileCloseButtonClick() {
    setModalTransactionFile(false); // ปิด modal
    setSelectedTransaction(null); // รีเซ็ตข้อมูล selectedTransaction
  }

  // ฟังก์ชันสำหรับแสดงรูปภาพใน modal
  function onClickImageButtonClick(image: TransactionImage) {
    setSelectedImage(image); // เก็บข้อมูลของภาพที่เลือก
  }

  const imageRequestConfig = {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  };

  function ModalImageShow() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={selectedImage !== null}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.modalCloseArea}
              onPress={() => setSelectedImage(null)}
            >
              {selectedImage && (
                <Image
                  source={{
                    uri: selectedImage.downloadUrl,
                    headers: imageRequestConfig.headers,
                  }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function ModalTransactionFileList() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalTransactionFile}
        onRequestClose={onTransactionFileCloseButtonClick}
      >
        {loadingTransaction || loadingImage ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.modalContainer}>
            <View style={styles.stepContainer}>
              <View style={styles.stepSection}>
                <Text style={styles.stepTitle}>Transaction Files</Text>
              </View>
              <GradientLine />
              <View style={{ padding: 10 }}>
                <FlatList
                  data={images}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity
                        onPress={() => onClickImageButtonClick(item)} // เมื่อคลิกที่ไฟล์ จะให้เปิดรูปภาพใน modal
                      >
                        <View style={styles.uploadedFileItem}>
                          <MaterialIcons
                            name="check-circle"
                            size={20}
                            color="green"
                          />
                          <Text style={styles.uploadedFileName}>
                            {item.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item) => item.name}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  scrollEnabled={false}
                />
              </View>
              <View style={styles.uploadContainer}>
                <View style={styles.buttonStep}>
                  <View style={styles.row}>
                    <GradientButton
                      title="Close"
                      status="normal"
                      width={100}
                      onPress={onTransactionFileCloseButtonClick}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </Modal>
    );
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
        ) : loadingBill ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          billItems && <BillItemTable billItems={billItems} />
        )}

        {bill.billStatus !== 2 && (
          <PaymentUpload
            qrCodeImage={require("../../assets/qr-code.png")}
            token={user?.token!}
            bill={bill}
            fetchTransaction={fetchTransactions}
          />
        )}

        {transactions?.length! > 0 && (
          <View>
            <Text style={styles.title}>History</Text>
            <GradientLine />

            <FlatList
              data={transactions}
              style={{ paddingTop: 16 }}
              renderItem={({ item }) => (
                <TransactionCard
                  transactionID={item.transactionID}
                  status={item.transactionStatus}
                  onPress={() => onTransactionFileButtonClick(item)} // เปิด modal
                />
              )}
              keyExtractor={(item) => item.transactionID.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {loadingTransaction && <Text>Loading...</Text>}
        {ModalImageShow()}
        {ModalTransactionFileList()}
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
  stepContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
    padding: 20,
  },
  stepSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  uploadContainer: {
    padding: 20,
    alignItems: "center",
  },
  buttonStep: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedFilesList: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  uploadedFileItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 4,
    marginBottom: 8,
  },
  uploadedFileName: {
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 16,
  },
  imageContainer: {
    width: imageWidth,
    height: imageWidth,
    margin: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  modalCloseArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

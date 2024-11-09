import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import UUID from "react-native-uuid";
import { uploadImageToGitHub } from "../../services/githubService";
import { GradientButton } from "./GradientButton";
import { GradientLine } from "./GradientLine";
import { colors } from "../../styles/colors";
import { BillService } from "../../services/billService";

// Types
interface FileType {
  uri: string;
  name: string;
  type: string;
}

interface Transaction {
  id: number;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  files?: FileType[];
}

interface Props {
  qrCodeImage: any;
  billID: number;
  token: string;
}

// Component
export function PaymentUpload({ qrCodeImage, billID, token }: Props) {
  // State
  const [modalQrVisible, setModalQrVisible] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);
  const [tempSelectedFiles, setTempSelectedFiles] = useState<FileType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Permission request
  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  // Handlers
  const onPaymentCloseButtonClick = () => {
    if (tempSelectedFiles.length > 0) {
      Alert.alert(
        "Confirm Exit",
        "You have unconfirmed files. Do you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Exit",
            onPress: () => {
              setTempSelectedFiles(selectedFiles);
              setModalQrVisible(false);
              setStep(1);
            },
          },
        ]
      );
    } else {
      setModalQrVisible(false);
      setStep(1);
    }
  };

  const pickImages = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.uri.split("/").pop() || `image-${UUID.v4()}.jpg`,
          type: "image/jpeg",
        }));
        setTempSelectedFiles([...tempSelectedFiles, ...newFiles]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const uploadToGithub = async (files: FileType[], transactionId: string) => {
    for (const file of files) {
      const imageName = `proof_${UUID.v4()}`;
      await uploadImageToGitHub(transactionId, file.uri, imageName);
    }
  };

  async function handleTransactionCreated(): Promise<number> {
    try {
      // Assuming BillService.createTransaction returns a transaction ID
      const transactionID = await BillService.createTransaction(billID, token);
      return transactionID.transaction_id; // Return the transaction ID
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create transaction");
    }
  }

  const onPaymentUploadButtonClick = async () => {
    if (tempSelectedFiles.length === 0) {
      Alert.alert("Notice", "Please select at least one file");
      return;
    }

    Alert.alert("Confirm Upload", "Do you want to proceed with the upload?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            setIsUploading(true);

            // เรียก handleTransactionCreated ที่มาจาก props
            const transactionId = await handleTransactionCreated(); // ใส่ bill_id ที่ต้องการ

            const newTransaction: Transaction = {
              id: transactionId,
              timestamp: new Date().toISOString(),
              status: "pending",
              files: tempSelectedFiles,
            };

            // อัปโหลดไฟล์
            await uploadToGithub(tempSelectedFiles, transactionId.toString());

            // อัปเดต state
            setSelectedFiles(tempSelectedFiles);
            setTransactions([...transactions, newTransaction]);

            // แจ้ง parent component
            Alert.alert("Success", "Files uploaded successfully");
            setTempSelectedFiles([]);
            setModalQrVisible(false);
            setStep(1);
          } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload files");
          } finally {
            setIsUploading(false);
          }
        },
      },
    ]);
  };

  const removeFile = (index: number) => {
    setTempSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Render methods
  const renderFileList = () => (
    <ScrollView style={styles.fileList}>
      {tempSelectedFiles.map((file, index) => (
        <View key={index} style={styles.fileItem}>
          <Text numberOfLines={1} style={styles.fileName}>
            {file.name}
          </Text>
          <TouchableOpacity
            onPress={() => removeFile(index)}
            style={styles.removeButton}
          >
            <MaterialIcons name="close" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderQRStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepSection}>
        <Text style={styles.stepTitle}>Save QR Code</Text>
      </View>
      <GradientLine />
      <View style={styles.uploadContainer}>
        <Image
          source={qrCodeImage}
          style={styles.qrCodeImage}
          resizeMode="contain"
        />
        <View style={styles.buttonStep}>
          <View style={styles.row}>
            <GradientButton
              title="Close"
              status="normal"
              width={100}
              onPress={onPaymentCloseButtonClick}
            />
            <GradientButton
              title="Next"
              status="normal"
              width={100}
              onPress={() => setStep(2)}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderUploadStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepSection}>
        <Text style={styles.stepTitle}>Upload Transaction</Text>
      </View>
      <GradientLine />
      <View style={styles.uploadContainer}>
        <TouchableOpacity style={styles.selectButton} onPress={pickImages}>
          <MaterialIcons name="file-upload" size={24} color="white" />
          <Text style={styles.selectButtonText}>Select File</Text>
        </TouchableOpacity>
        {renderFileList()}
        <View style={styles.buttonStep}>
          <View style={styles.row}>
            <GradientButton
              title="Close"
              status="normal"
              width={100}
              onPress={onPaymentCloseButtonClick}
            />
            <GradientButton
              title="Confirm"
              status="normal"
              width={100}
              onPress={onPaymentUploadButtonClick}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalQrVisible}
        onRequestClose={onPaymentCloseButtonClick}
      >
        <View style={styles.modalContainer}>
          {step === 1 ? renderQRStep() : renderUploadStep()}
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isUploading}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingModalBackground}>
          <View style={styles.loadingModalContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingModalText}>Uploading...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonTranscription}>
        <GradientButton
          title="Transaction"
          status="normal"
          onPress={() => setModalQrVisible(true)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  },
  qrCodeImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  selectButton: {
    backgroundColor: colors.gradient_secondary,
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selectButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  fileList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 5,
  },
  fileName: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  buttonStep: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonTranscription: {
    margin: 10,
  },
  // Loading Modal Styles
  loadingModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingModalText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

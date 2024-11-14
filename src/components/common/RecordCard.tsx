import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../styles/colors";
import { LedgerItem } from "../../models/LedgerItem";
import React, { useState } from "react";
import { User } from "../../models/User";
import { GradientLine } from "./GradientLine";
import { IBillItemResponse } from "../../types/billItem.types";
import { BillItem } from "../../models/BillItem";
import { BillItemTable } from "./BillItemTable";

type RecordCardProps = {
  ledgerItem: LedgerItem;
  user: User;
  onUpdate?: (updatedItem: LedgerItem) => Promise<void>;
  onIssue?: (item: LedgerItem) => Promise<void>;
};

export function RecordCard({
  ledgerItem,
  user,
  onUpdate,
  onIssue,
}: RecordCardProps) {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isIssueModalVisible, setIssueModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

  const [billItemsTmp, setBillItemsTmp] = useState<BillItem[] | null>(null);

  const [waterUnit, setWaterUnit] = useState(ledgerItem.waterUnit.toString());
  const [electricityUnit, setElectricityUnit] = useState(
    ledgerItem.electricityUnit.toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateNumber = (value: string): boolean => {
    // Allow only numbers and one decimal point
    return /^\d*\.?\d*$/.test(value);
  };

  const handleWaterChange = (text: string) => {
    if (validateNumber(text) || text === "") {
      setWaterUnit(text);
    }
  };

  const handleElectricityChange = (text: string) => {
    if (validateNumber(text) || text === "") {
      setElectricityUnit(text);
    }
  };

  const handleUpdate = async () => {
    if (isSubmitting) return;

    // Validate inputs
    if (!waterUnit.trim() || !electricityUnit.trim()) {
      Alert.alert("Error", "Please enter both water and electricity units");
      return;
    }

    const water = parseFloat(waterUnit);
    const electricity = parseFloat(electricityUnit);

    if (isNaN(water) || isNaN(electricity)) {
      Alert.alert("Error", "Please enter valid numbers");
      return;
    }

    if (water < 0 || electricity < 0) {
      Alert.alert("Error", "Values cannot be negative");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedItem = new LedgerItem({
        ...ledgerItem.toJSON(),
        water_unit: water,
        electricity_unit: electricity,
      });

      await onUpdate?.(updatedItem);
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update readings");
    } finally {
      setIsSubmitting(false);
    }
  };

  function handleReview() {
    const data: IBillItemResponse[] = [
      {
        bill_id: -1,
        bill_item_name: "ค่าน้ำ",
        bill_item_number: 1,
        unit: ledgerItem.waterUnit,
        unit_price: ledgerItem.contract.water_rate,
      },
      {
        bill_id: -1,
        bill_item_name: "ค่าไฟ",
        bill_item_number: 2,
        unit: ledgerItem.electricityUnit,
        unit_price: ledgerItem.contract.electricity_rate,
      },

      {
        bill_id: -1,
        bill_item_name: "ค่าห้อง",
        bill_item_number: 3,
        unit: 1,
        unit_price: ledgerItem.contract.rental_price,
      },

      {
        bill_id: -1,
        bill_item_name: "ค่าอินเตอร์เน็ต",
        bill_item_number: 4,
        unit: 1,
        unit_price: ledgerItem.contract.internet_service_fee,
      },
    ];

    const billItem = data.map((item) => BillItem.fromResponse(item));
    setBillItemsTmp(billItem);
    setReviewModalVisible(true);
  }

  const handleIssue = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onIssue?.(ledgerItem);
      setIssueModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to issue bill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomTitle}>
          Room: {ledgerItem.ledgerItemRoomNumber}
        </Text>
        {ledgerItem.ledgerItemStatus == 1 && (
          <View style={styles.billStatus}>
            <Text style={styles.billStatusText}>Billed</Text>
          </View>
        )}
      </View>
      <GradientLine />
      <View style={styles.readingContainer}>
        <View style={styles.meterGrid}>
          <View style={styles.meterItem}>
            <Text style={styles.meterLabel}>Water</Text>
            <View style={styles.meterValues}>
              <Text style={styles.currentValue}>{ledgerItem.waterUnit}</Text>
            </View>
          </View>
          <View style={styles.meterItem}>
            <Text style={styles.meterLabel}>Electricity</Text>
            <View style={styles.meterValues}>
              <Text style={styles.currentValue}>
                {ledgerItem.electricityUnit}
              </Text>
            </View>
          </View>
        </View>
        {ledgerItem.ledgerItemStatus == 0 && (
          <View style={styles.actionButtons}>
            {(user.roles.includes("accountant") ||
              user.roles.includes("manager")) && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditModalVisible(true)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}

            {(user.roles.includes("cashier") ||
              user.roles.includes("manager")) &&
              ledgerItem.contract.username !== "" && (
                <View>
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={handleReview}
                  >
                    <Text style={styles.buttonText}>Review</Text>
                  </TouchableOpacity>
                </View>
              )}

            {(user.roles.includes("cashier") ||
              user.roles.includes("manager")) &&
              ledgerItem.contract.username !== "" && (
                <View>
                  <TouchableOpacity
                    style={styles.issueButton}
                    onPress={() => setIssueModalVisible(true)}
                  >
                    <Text style={styles.buttonText}>Issue</Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        )}
      </View>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Readings</Text>
            <Text style={styles.modalSubtitle}>
              Room {ledgerItem.ledgerItemRoomNumber} - {ledgerItem.ledgerMonth}/
              {ledgerItem.ledgerYear}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Water Unit</Text>
              <TextInput
                style={styles.input}
                value={waterUnit}
                onChangeText={handleWaterChange}
                keyboardType="numeric"
                placeholder="Enter water unit"
                placeholderTextColor={colors.grey}
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Electricity Unit</Text>
              <TextInput
                style={styles.input}
                value={electricityUnit}
                onChangeText={handleElectricityChange}
                keyboardType="numeric"
                placeholder="Enter electricity unit"
                placeholderTextColor={colors.grey}
                maxLength={10}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdate}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={isReviewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <ScrollView
          style={styles.modalScrollOverlay}
          contentContainerStyle={styles.modalContentContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bill Details</Text>
            <View>
              {billItemsTmp && <BillItemTable billItems={billItemsTmp} />}
            </View>
            <TouchableOpacity
              style={[styles.modalButton, styles.okButton]}
              onPress={() => setReviewModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Issue Confirmation Modal */}
      <Modal
        visible={isIssueModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIssueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Issue Bill</Text>
            <Text style={styles.modalSubtitle}>
              Room {ledgerItem.ledgerItemRoomNumber} - {ledgerItem.ledgerMonth}/
              {ledgerItem.ledgerYear}
            </Text>
            <Text style={styles.confirmationText}>
              Are you sure you want to issue a bill for this room?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIssueModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.issueConfirmButton]}
                onPress={handleIssue}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>
                  {isSubmitting ? "Processing..." : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  billStatus: {
    backgroundColor: "#58faa9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  billStatusText: {
    color: "#133115",
    fontWeight: "500",
    fontSize: 12,
  },
  readingContainer: {
    paddingTop: 16,
  },
  meterGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  meterItem: {
    flex: 1,
  },
  meterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.grey,
    marginBottom: 8,
  },
  meterValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currentValue: {
    fontWeight: "bold",
    color: colors.white,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#3f67bf",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  issueButton: {
    backgroundColor: "#29906f",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  reviewButton: {
    backgroundColor: "#592990",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    color: colors.white,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.grey,
  },
  saveButton: {
    backgroundColor: "#3f67bf",
  },
  issueConfirmButton: {
    backgroundColor: "#29906f",
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 16,
  },

  okButton: {
    backgroundColor: "#29906f",
  },

  modalContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

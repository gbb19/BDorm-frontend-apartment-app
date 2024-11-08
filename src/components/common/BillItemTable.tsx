import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../styles/colors";
import { BillItem } from "../../models/BillItem";

interface BillItemTableProps {
  billItems: BillItem[];
}

export function BillItemTable({ billItems }: BillItemTableProps) {
  const [searchQuery] = useState<string>("");

  const filteredBills = billItems.filter((bill) =>
    bill.billItemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredBills.reduce((sum, bill) => {
    const unit = bill.unit;
    const unitPrice = bill.unitPrice;
    const price = unit * unitPrice;
    return sum + price;
  }, 0);

  // Ensure TableHeader has a return statement to output JSX
  function TableHeader() {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>รายการ</Text>
        <Text style={styles.headerText}>จำนวน</Text>
        <Text style={styles.headerText}>ราคา/หน่วย</Text>
        <Text style={styles.headerText}>จำนวนเงิน</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <TableHeader />
        <ScrollView style={styles.scrollView}>
          {filteredBills.map((bill, index) => {
            const unit = bill.unit;
            const unitPrice = bill.unitPrice;
            const price = unit * unitPrice;

            return (
              <View
                key={bill.billItemNumber}
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={[styles.cell, styles.nameCell]}>
                  {bill.billItemName}
                </Text>
                <Text style={[styles.cell, styles.numberCell]}>{unit}</Text>
                <Text style={[styles.cell, styles.numberCell]}>
                  {unitPrice}
                </Text>
                <Text style={[styles.cell, styles.numberCell]}>
                  {price.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>รวมทั้งสิ้น:</Text>
          <Text style={styles.totalAmount}>
            {totalAmount.toLocaleString()} บาท
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tableContainer: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    padding: 12,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: "75%",
  },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  evenRow: {
    backgroundColor: colors.tertiary,
  },
  oddRow: {
    backgroundColor: "#B3B3B3",
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  nameCell: {
    textAlign: "left",
    color: colors.white,
  },
  numberCell: {
    textAlign: "center",
    color: colors.white,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: "#dee2e6",
    backgroundColor: colors.secondary,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "bold",
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
});

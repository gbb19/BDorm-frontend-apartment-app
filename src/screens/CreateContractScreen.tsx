import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from "../styles/colors";
import { Tenant } from "../models/Tenant";
import { UserService } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { IContractCreate } from "../types/contract.types";
import { ContractService } from "../services/contractService";
import { GradientButton } from "../components/common/GradientButton";

export function CreateContractScreen() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [error, setError] = useState<string>("");

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [dropdownItems, setDropdownItems] = useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);

  // Form state
  const [contractYear, setContractYear] = useState<string>("");
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [rentalPrice, setRentalPrice] = useState<string>("");
  const [waterRate, setWaterRate] = useState<string>("");
  const [electricityRate, setElectricityRate] = useState<string>("");
  const [internetFee, setInternetFee] = useState<string>("");

  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    const items = tenants.map((tenant) => ({
      label: `${tenant.fullName} (${tenant.username})`,
      value: tenant.username,
    }));
    setDropdownItems(items);
  }, [tenants]);

  async function fetchTenants() {
    try {
      const tenantData = await UserService.getAllTenants(user?.token!);
      setTenants(tenantData);
    } catch (err) {
      setError("Failed to fetch tenants");
    }
  }

  const handleCreateContract = async () => {
    if (
      !selectedTenant ||
      !contractYear ||
      !roomNumber ||
      !rentalPrice ||
      !waterRate ||
      !electricityRate ||
      !internetFee
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const contractData: IContractCreate = {
        contract_year: parseInt(contractYear),
        contract_room_number: parseInt(roomNumber),
        rental_price: parseFloat(rentalPrice),
        water_rate: parseFloat(waterRate),
        electricity_rate: parseFloat(electricityRate),
        internet_service_fee: parseFloat(internetFee),
        username: selectedTenant,
      };

      await ContractService.createContract(contractData, user?.token!);
      Alert.alert("Success", "Contract created successfully");
      // Reset form
      setSelectedTenant(null);
      setContractYear("");
      setRoomNumber("");
      setRentalPrice("");
      setWaterRate("");
      setElectricityRate("");
      setInternetFee("");
    } catch (err) {
      Alert.alert("Error", "Failed to create contract");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Create Contract</Text>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={open}
                value={selectedTenant}
                items={dropdownItems}
                setOpen={setOpen}
                setValue={setSelectedTenant}
                setItems={setDropdownItems}
                placeholder="Select a tenant"
                searchable={true}
                searchPlaceholder="Search for tenant..."
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropDownContainerStyle={styles.dropdownList}
                searchContainerStyle={styles.searchContainer}
                searchTextInputStyle={styles.searchInput}
                listMode="SCROLLVIEW"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contract Year</Text>
              <TextInput
                style={styles.input}
                value={contractYear}
                onChangeText={setContractYear}
                keyboardType="numeric"
                placeholder="Enter contract year"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Number</Text>
              <TextInput
                style={styles.input}
                value={roomNumber}
                onChangeText={setRoomNumber}
                keyboardType="numeric"
                placeholder="Enter room number"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rental Price</Text>
              <TextInput
                style={styles.input}
                value={rentalPrice}
                onChangeText={setRentalPrice}
                keyboardType="numeric"
                placeholder="Enter rental price"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Water Rate</Text>
              <TextInput
                style={styles.input}
                value={waterRate}
                onChangeText={setWaterRate}
                keyboardType="numeric"
                placeholder="Enter water rate"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Electricity Rate</Text>
              <TextInput
                style={styles.input}
                value={electricityRate}
                onChangeText={setElectricityRate}
                keyboardType="numeric"
                placeholder="Enter electricity rate"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Internet Service Fee</Text>
              <TextInput
                style={styles.input}
                value={internetFee}
                onChangeText={setInternetFee}
                keyboardType="numeric"
                placeholder="Enter internet fee"
                placeholderTextColor="#999"
              />
            </View>

            <GradientButton
              title="Create Contract"
              status="normal"
              onPress={handleCreateContract}
            />
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  formContainer: {
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 2000,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
  },
  searchContainer: {
    borderBottomColor: "#E8E8E8",
  },
  searchInput: {
    borderColor: "#E8E8E8",
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

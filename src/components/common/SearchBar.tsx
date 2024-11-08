import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({
  placeholder,
  onSearch,
  value,
  onChangeText,
}: SearchBarProps) {
  const [query, setQuery] = useState<string>(value);

  const handleChange = (text: string) => {
    setQuery(text);
    onChangeText(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery("");
    onChangeText("");
    onSearch("");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={handleChange}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#B0B0B0"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Ionicons name="close" size={20} color={colors.lightGrey} />
        </TouchableOpacity>
      )}
      <Ionicons
        name="search"
        size={20}
        color={colors.lightGrey}
        style={styles.searchIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tertiary,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
});
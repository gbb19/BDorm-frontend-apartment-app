import React from "react";
import { View , StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../components/common/TopBar";
import { colors } from "../styles/colors";

export function BluePrint(){
  return(
    <SafeAreaView style={styles.container}>
      <TopBar/>
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
});

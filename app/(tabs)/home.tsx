import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../src/components/ui/logo";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>STL.Maker</Text>

        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Logo size="large" />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E121B",
  },
  header: {
    height: 56,
    backgroundColor: "#ff7a00",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 180,
    height: 180,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ff7a00",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E121B",
  },
});

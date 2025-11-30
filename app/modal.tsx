import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal STL.Maker</Text>
      <Text style={styles.text}>
        Este é um exemplo de tela modal. Você pode usar este espaço no futuro
        para exibir detalhes de uma solicitação, avisos importantes ou
        confirmações.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#f0f0f0",
    textAlign: "center",
  },
});

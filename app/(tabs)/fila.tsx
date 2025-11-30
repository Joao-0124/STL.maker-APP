import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MOCK_SOLICITACOES = [
  { id: 1, titulo: "Suporte de Monitor", statusPrioridade: "ALTA" },
  { id: 2, titulo: "Engrenagem 20 dentes", statusPrioridade: "MEDIA" },
  { id: 3, titulo: "Case Raspberry Pi", statusPrioridade: "BAIXA" },
  { id: 4, titulo: "Miniatura STL.Maker", statusPrioridade: "ALTA" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "ALTA":
      return "#e53935"; // vermelho
    case "MEDIA":
      return "#fdd835"; // amarelo
    case "BAIXA":
    default:
      return "#43a047"; // verde
  }
}

export default function RegistroSolicitacoesScreen() {
  const router = useRouter();

  const abrirDetalhe = (item: (typeof MOCK_SOLICITACOES)[number]) => {
    router.push({
      pathname: "detalhe-solicitacao",
      params: {
        id: item.id.toString(),
        titulo: item.titulo,
        statusPrioridade: item.statusPrioridade,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Fila de Impressão</Text>
        <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
      </View>

      <FlatList
        data={MOCK_SOLICITACOES}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => abrirDetalhe(item)}
          >
            <View style={styles.previewBox}>
              <Ionicons name="cube-outline" size={24} color="#999" />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardSubtitle}>
                Prioridade: {item.statusPrioridade}
              </Text>
            </View>

            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.statusPrioridade) },
              ]}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E121B", // fundo escuro
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#0E121B", // header no mesmo fundo
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  previewBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    color: "#111",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

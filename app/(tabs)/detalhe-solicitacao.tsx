import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/config/api";

type SolicitacaoDetalhe = any;

export default function DetalheSolicitacaoScreen() {
  const router = useRouter();
  const { id, nome, status } = useLocalSearchParams<{
    id: string;
    nome?: string;
    status?: string;
  }>();

  const [dados, setDados] = useState<SolicitacaoDetalhe | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDetalhe = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setErro(null);

      const response = await api.get(`/solicitacao/${id}`);
      setDados(response.data);
    } catch (e) {
      console.log("Erro ao carregar detalhe da solicitação:", e);
      setErro("Não foi possível carregar os detalhes da solicitação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDetalhe();
  }, [id]);

  const voltarRegistro = () => {
    router.back();
  };

  const irParaHome = () => {
    router.replace("/home");
  };

  const formatKey = (key: string) => {
    return key.replace(/_/g, " ").toUpperCase();
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={voltarRegistro}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.headerText}>Detalhes da Solicitação</Text>

        <TouchableOpacity onPress={irParaHome}>
          <Ionicons name="home-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ff7a00" />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      )}

      {!loading && erro && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{erro}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={carregarDetalhe}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !erro && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>{nome || dados?.nome || "Solicitação"}</Text>
          {status && (
            <Text style={styles.statusText}>Prioridade: {status}</Text>
          )}

          <View style={styles.divider} />

          {dados &&
            Object.entries(dados).map(([key, value]) => (
              <View style={styles.row} key={key}>
                <Text style={styles.label}>{formatKey(key)}:</Text>
                <Text style={styles.value}>{formatValue(value)}</Text>
              </View>
            ))}

          {!dados && (
            <Text style={styles.emptyText}>
              Nenhum dado detalhado retornado pela API.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E121B" },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#0E121B",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: { color: "#FFFFFF", fontSize: 14 },
  centerContent: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 8, color: "#FFFFFF" },
  errorText: { color: "#ff6b6b", textAlign: "center", marginBottom: 12 },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ff7a00",
  },
  retryText: { color: "#fff", fontWeight: "600" },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  emptyText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 16,
  },
});

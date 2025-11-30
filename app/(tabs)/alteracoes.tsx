import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const isAdmin = true;

export default function DetalheSolicitacaoScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string;
    titulo?: string;
    statusPrioridade?: string;
  }>();

  const [prioridade, setPrioridade] = useState(
    params.statusPrioridade ?? "MEDIA"
  );
  const [impressora, setImpressora] = useState("");
  const [tempoAposInicio, setTempoAposInicio] = useState("");
  const [filamento, setFilamento] = useState("");
  const [cor, setCor] = useState("");

  const goRegistro = () => {
    router.replace("/(tabs)/registro");
  };

  const handleSalvar = async () => {
    if (!isAdmin) return;

    try {

      console.log("Salvar configuração da solicitação:", {
        id: params.id,
        prioridade,
        impressora,
        tempoAposInicio,
        filamento,
        cor,
      });

      Alert.alert("Sucesso", "Configurações da fila atualizadas!");
      goRegistro();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    }
  };

  const renderPrioridadeButton = (
    value: string,
    label: string,
    color: string
  ) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.priorityPill,
        prioridade === value && { backgroundColor: color },
      ]}
      onPress={() => setPrioridade(value)}
      disabled={!isAdmin}
    >
      <Text
        style={[
          styles.priorityText,
          prioridade === value && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isAdmin ? "ADMIN - Fila de Impressão" : "Detalhes da Solicitação"}
        </Text>

        <TouchableOpacity onPress={isAdmin ? handleSalvar : goRegistro}>
          <Ionicons name="arrow-forward-circle" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <Text style={styles.tituloSolicitacao}>
          {params.titulo ?? "Solicitação sem título"}
        </Text>
        {params.id && <Text style={styles.subInfo}>ID: {params.id}</Text>}
        {params.statusPrioridade && (
          <Text style={styles.subInfo}>
            Prioridade atual: {params.statusPrioridade}
          </Text>
        )}

        <Text style={styles.label}>Grau de Prioridade</Text>
        <View style={styles.priorityRow}>
          {renderPrioridadeButton("ALTA", "Alta", "#e53935")}
          {renderPrioridadeButton("MEDIA", "Média", "#fdd835")}
          {renderPrioridadeButton("BAIXA", "Baixa", "#43a047")}
        </View>

        <Text style={styles.label}>Impressora</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome ou código da impressora"
          value={impressora}
          onChangeText={setImpressora}
          editable={isAdmin}
        />

        <Text style={styles.label}>Tempo após início</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 2h 30min"
          value={tempoAposInicio}
          onChangeText={setTempoAposInicio}
          editable={isAdmin}
        />

        <Text style={styles.label}>Filamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: PLA, ABS..."
          value={filamento}
          onChangeText={setFilamento}
          editable={isAdmin}
        />

        <Text style={styles.label}>Cor</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Preto, Branco..."
          value={cor}
          onChangeText={setCor}
          editable={isAdmin}
        />

        {isAdmin && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>Salvar configurações</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  header: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  box: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tituloSolicitacao: {
    fontSize: 16,
    fontWeight: "700",
  },
  subInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  priorityText: {
    fontSize: 12,
    color: "#333",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#ff7a00",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "700" },
});

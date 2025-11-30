import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { api } from "../../src/config/api";

export default function NovaSolicitacaoScreen() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [dimensoes, setDimensoes] = useState("");
  const [arquivo, setArquivo] = useState<{
    name: string;
    uri: string;
    mimeType?: string | null;
  } | null>(null);
  const [aceitouTermo, setAceitouTermo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const goHome = () => {
    router.replace("/(tabs)");
  };

  const selecionarArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (!file.name.toLowerCase().endsWith(".stl")) {
        Alert.alert("Arquivo inválido", "Selecione um arquivo com extensão .stl");
        return;
      }

      setArquivo({
        name: file.name,
        uri: file.uri,
        mimeType: file.mimeType,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  };

  const enviarSolicitacao = async () => {
    if (!titulo.trim() || !quantidade.trim()) {
      Alert.alert("Atenção", "Preencha pelo menos título e quantidade.");
      return;
    }

    if (!aceitouTermo) {
      Alert.alert("Atenção", "Você precisa aceitar o termo de consentimento.");
      return;
    }

    if (!arquivo) {
      Alert.alert("Atenção", "Selecione um arquivo STL.");
      return;
    }

    try {
      setEnviando(true);

      const payload = {
        nome: titulo,
        descricao,
        quantidade: Number(quantidade),
        dimensao_xyz: dimensoes,
        arquivo_nome: arquivo.name,
      };

      await api.post("/solicitacao", payload);

      Alert.alert("Sucesso", "Solicitação enviada com sucesso!");

      setTitulo("");
      setDescricao("");
      setQuantidade("1");
      setDimensoes("");
      setArquivo(null);
      setAceitouTermo(false);

      goHome();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Solicitação</Text>

        <TouchableOpacity
          onPress={enviarSolicitacao}
          disabled={enviando}
          style={styles.headerButton}
        >
          {enviando ? (
            <Text style={styles.headerButtonText}>...</Text>
          ) : (
            <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Nome da peça ou projeto"
        />

        <Text style={styles.label}>Descrição / Objetivo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Explique o objetivo da impressão, detalhes importantes etc."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
          placeholder="1"
        />

        <Text style={styles.label}>Dimensões (XYZ)</Text>
        <TextInput
          style={styles.input}
          value={dimensoes}
          onChangeText={setDimensoes}
          placeholder="Ex.: 100 x 50 x 30 mm"
        />

        <Text style={styles.label}>Upload de Arquivo (.stl)</Text>
        <View style={styles.uploadRow}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={selecionarArquivo}
          >
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>Selecionar arquivo</Text>
          </TouchableOpacity>
        </View>
        {arquivo && (
          <Text style={styles.fileName}>
            Arquivo selecionado: {arquivo.name}
          </Text>
        )}

        <View style={styles.termoContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAceitouTermo(!aceitouTermo)}
          >
            {aceitouTermo && (
              <Ionicons name="checkmark" size={18} color="#ff7a00" />
            )}
          </TouchableOpacity>
          <Text style={styles.termoTexto}>
            Termo de Consentimento: Eu concordo que fica a cargo do
            Administrador definir a cor, caso a desejada não tenha disponível,
            além de decidir o filamento, impressora e demais parâmetros de
            impressão necessários para a melhor qualidade possível.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.enviarButton, enviando && styles.enviarButtonDisabled]}
          onPress={enviarSolicitacao}
          disabled={enviando}
        >
          <Text style={styles.enviarButtonText}>
            {enviando ? "Enviando..." : "Enviar Solicitação"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 56,
    backgroundColor: "#ff7a00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    height: 120,
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ff7a00",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  fileName: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
  },
  termoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ff7a00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  termoTexto: {
    flex: 1,
    fontSize: 12,
    color: "#444",
  },
  enviarButton: {
    marginTop: 24,
    backgroundColor: "#ff7a00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  enviarButtonDisabled: {
    opacity: 0.7,
  },
  enviarButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

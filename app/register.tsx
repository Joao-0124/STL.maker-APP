import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "../src/config/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    console.log("=== CLICOU EM CADASTRAR ===");

    if (!nome.trim() || !usuario.trim() || !matricula.trim() || !email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não conferem.");
      return;
    }

    if (isNaN(Number(matricula))) {
      Alert.alert("Atenção", "Matrícula deve ser um número.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        usuario,
        matricula: Number(matricula),
        email,
        nome,
        senha,
      };

      console.log("Enviando cadastro para API:", payload);

      const response = await api.post("/usuario", payload);

      console.log("RESPOSTA CADASTRO:", response.status, response.data);

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      console.log("=== ERRO NO CADASTRO ===");
      if (error?.response) {
        console.log("Status:", error.response.status);
        console.log("Body:", error.response.data);
        Alert.alert(
          "Erro",
          `Falha ao cadastrar. Código: ${error.response.status}`
        );
      } else {
        console.log("Erro sem response (provável Network Error):", error?.message);
        Alert.alert("Erro", "Não foi possível comunicar com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const irParaLogin = () => {
    router.push("/login");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32, justifyContent: "center", flexGrow: 1 }}
    >
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Cadastre-se para usar o STL.Maker</Text>

      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Usuário (login)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        placeholderTextColor="#999"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de matrícula"
        placeholderTextColor="#999"
        value={matricula}
        onChangeText={setMatricula}
        keyboardType="numeric"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#999"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={irParaLogin} style={styles.linkButton}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#0E121B" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 4, color: "#fff" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 24, color: "#ccc" },
  label: { fontSize: 14, marginBottom: 4, marginTop: 8, color: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#ff7a00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { marginTop: 16 },
  linkText: { textAlign: "center", color: "#ccc", textDecorationLine: "underline" },
});

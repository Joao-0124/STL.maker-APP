// app/login.tsx  (ou src/screens/LoginScreen.tsx)
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { api } from "../src/config/api"; // ajuste o caminho se estiver em outra pasta

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ Ajuste aqui para o endpoint real da sua API de login
      // Exemplo: POST /usuario/login  { email, senha }
      const { data } = await api.post("/usuario/login", {
        email,
        senha,
      });

      // data deve ser o objeto Usuario vindo do backend
      console.log("Usuário logado:", data);

      Alert.alert("Sucesso", `Bem-vindo(a), ${data.nome}!`);

      // aqui você pode:
      // - salvar o usuário em um contexto / AsyncStorage
      // - redirecionar para as tabs (lista de solicitações, etc)

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Falha ao entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  // Se tiver navegação, você pode receber props e usar algo como:
  // const router = useRouter() (Expo Router) ou navigation.navigate("Cadastro")
  // Aqui vou deixar um TODO:
  const irParaCadastro = () => {
    // TODO: navegação para tela de cadastro (ex.: router.push("/cadastro"))
    Alert.alert("Navegação", "Aqui você navega para a tela de cadastro.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>STL.Maker</Text>
      <Text style={styles.subtitle}>Gerencie seus pedidos de impressão 3D</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@exemplo.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={irParaCadastro} style={styles.linkButton}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f5f5f5" },
  logo: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 32, color: "#555" },
  label: { fontSize: 14, marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff7a00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { marginTop: 20 },
  linkText: { textAlign: "center", color: "#555", textDecorationLine: "underline" },
});

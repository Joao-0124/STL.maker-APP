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
import { useRouter } from "expo-router";
import { api } from "../src/config/api";
import { Logo } from "../src/components/ui/logo";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("=== CLICOU NO ENTRAR ===");

    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      console.log("Enviando para API:", { email, senha });

      const response = await api.post("/usuario/login", {
        email,
        senha,
      });

      console.log(
        "LOGIN OK - STATUS:",
        response.status,
        "DATA:",
        response.data
      );
      
      router.replace("/home");
    } catch (error: any) {
      console.log("=== ERRO NO LOGIN ===");

      if (error?.response) {
        console.log(
          "Status erro:",
          error.response.status,
          "Data:",
          error.response.data
        );
      } else {
        console.log(
          "Erro sem response (provável Network Error):",
          error.message
        );
      }

      if (error?.response?.status === 401) {
        Alert.alert("Erro", "E-mail ou senha inválidos.");
      } else {
        Alert.alert("Erro", "Falha ao entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const irParaRegistro = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size="large" />
      </View>

      <Text style={styles.logo}>Gerencie seus pedidos de impressão 3D</Text>
      <Text style={styles.subtitle}></Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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

      <TouchableOpacity onPress={irParaRegistro} style={styles.linkButton}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#0E121B",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 8,
    color: "#FFFFFF",
  },
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});

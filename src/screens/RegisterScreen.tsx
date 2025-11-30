// app/cadastro.tsx  (ou src/screens/RegisterScreen.tsx)
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
import { api } from "../src/config/api"; // ajuste o caminho se necessário

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
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

      // Montando o objeto conforme a tabela USUARIO
      const payload = {
        usuario,                // USUARIO (login)
        matricula: Number(matricula),
        email,
        nome,
        senha,
        // perfil_id: 1,        // se quiser atribuir perfil padrão
      };

      const { data } = await api.post("/usuario", payload);

      console.log("Usuário cadastrado:", data);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      // reset campos
      setNome("");
      setUsuario("");
      setMatricula("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      // aqui você pode navegar automaticamente para login
      // ex.: router.replace("/login") ou navigation.navigate("Login")

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  const irParaLogin = () => {
    // TODO: navegação para tela de login (ex.: router.push("/login"))
    Alert.alert("Navegação", "Aqui você navega para a tela de login.");
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
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Usuário (login)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de matrícula"
        value={matricula}
        onChangeText={setMatricula}
        keyboardType="numeric"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="seuemail@exemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar senha</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
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
  container: { flex: 1, padding: 24, backgroundColor: "#f5f5f5" },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 24, color: "#555" },
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
    marginTop: 24,
    backgroundColor: "#ff7a00",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkButton: { marginTop: 16 },
  linkText: { textAlign: "center", color: "#555", textDecorationLine: "underline" },
});

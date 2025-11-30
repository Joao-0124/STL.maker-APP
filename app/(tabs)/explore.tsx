import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

type Message = {
  id: string;
  text?: string;
  imageUri?: string;
  from: "user" | "admin";
  createdAt: number;
};

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const userName = "USER";

  const addMessage = (msg: Omit<Message, "id" | "createdAt">) => {
    setMessages((old) => [
      ...old,
      {
        ...msg,
        id: String(Date.now() + Math.random()),
        createdAt: Date.now(),
      },
    ]);
  };

  const handleSendText = () => {
    if (!text.trim()) return;
    addMessage({ text: text.trim(), from: "user" });
    setText("");
  };

  const tirarFoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à câmera para tirar a foto."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: false,
      });

      if (result.canceled) return;

      const photo = result.assets[0];
      addMessage({ imageUri: photo.uri, from: "user" });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
    }
  };

  const handleBack = () => {
    router.replace("/home"); // se a sua home for /login ou outra, troca aqui
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isFromUser = item.from === "user";

    return (
      <View
        style={[
          styles.bubble,
          isFromUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        {item.text ? <Text style={styles.bubbleText}>{item.text}</Text> : null}

        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.bubbleImage}
          />
        ) : null}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{userName}</Text>

        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="chevron-forward"
            size={26}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.chatBox}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      </View>

      <View style={styles.bottomBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity
          style={styles.iconButton}
          onPress={tirarFoto}
        >
          <Ionicons name="camera-outline" size={22} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendText}
        >
          <Ionicons name="checkmark" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },

  chatBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  bubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: "#ffebcc",
  },
  bubbleText: {
    fontSize: 14,
    color: "#333",
  },
  bubbleImage: {
    marginTop: 4,
    width: 160,
    height: 160,
    borderRadius: 8,
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    marginRight: 6,
  },
  sendButton: {
    width: 40,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff7a00",
  },
});

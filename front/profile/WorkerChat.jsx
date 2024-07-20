import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import io from "socket.io-client";
import { BASE_URL } from "../private.json";
import { FontAwesome } from "@expo/vector-icons";

const WorkerChatModal = ({ workerId, clientId, isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [socket, setSocket] = useState(null);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isVisible) {
      const newSocket = io(BASE_URL);
      setSocket(newSocket);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      newSocket.emit("joinconvo", { clientId, workerId });

      newSocket.on("conversationId", (id) => {
        setConversationId(id);
        fetchOldMessages(newSocket, id);
      });

      newSocket.on("messagecoming", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isVisible]);

  const fetchOldMessages = (socket, id) => {
    socket.emit("oldmsgs", { conversationid: id });
    socket.on("messages", (msgs) => {
      setMessages(msgs);
      console.log(msgs, "hethom");
    });
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      socket.emit("sendmsg", {
        workerId,
        clientId,
        content: newMessage,
        conversationid: conversationId,
        sender: "worker",
      });
      setNewMessage("");
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={item.sender === "worker" ? styles.myMessage : styles.theirMessage}
    >
      <Text
        style={
          item.sender === "worker"
            ? styles.myMessageText
            : styles.theirMessageText
        }
      >
        {item.content}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="arrow-left" size={24} color="#042630" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <FontAwesome name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  closeButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#042630",
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#42a5f5",
    borderRadius: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#42a5f5",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessageText: {
    color: "#fff",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  theirMessageText: {
    color: "#000",
  },
});

export default WorkerChatModal;

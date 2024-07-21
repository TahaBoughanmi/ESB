import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Linking,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const WorkerDetailsScreen = ({ worker, onClose, visible, navigation }) => {
  const Chat = async () => {
    try {
      const clientData = await AsyncStorage.getItem("user");
      const client = JSON.parse(clientData);
      console.log(client, "worker");
      if (client) {
        console.log(worker);
        navigation.navigate("Home", {
          screen: "Chat",
          params: {
            workerId: parseInt(worker.idworker),
            clientId: parseInt(client.idClient),
          },
        });
        // navigation.navigate("Chat", {
        //   workerId: parseInt(worker.idworker),
        //   clientId: parseInt(client.idClient),
        // });
      } else {
        console.error("Client ID not found");
      }
    } catch (error) {
      console.error("Error retrieving client ID:", error);
    }
  };
  const handleContactPress = (number) => {
    const phoneUrl = `tel:${number}`;
    Linking.openURL(phoneUrl);
  };

  if (!visible) return null;

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: worker.picture }} style={styles.workerImage} />
          <Text style={styles.workerTitle}>
            {worker.userName}{" "}
            {worker.status && (
              <Icon name="check-circle" size={20} color="green" />
            )}
          </Text>
          <Text style={styles.jobTitle}>{worker.jobTitle}</Text>
          <Text style={styles.workerDescription}>
            Hourly Rate: ${worker.hourlyRate}
          </Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={worker.rating}
              size={20}
              showRating={false}
              isDisabled={true}
            />
          </View>
          <Text style={styles.workerDescription}>
            Address: {worker.address}
          </Text>
          <MapView style={styles.map}>
            <Marker
              coordinate={{
                latitude: Number(worker.latitude),
                longitude: Number(worker.longitude),
              }}
            />
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.chatButton} onPress={Chat}>
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactPress(worker.phoneNum)}
            >
              <FontAwesome
                name="phone"
                size={40}
                color="#042630"
                style={styles.contactIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e6ede6",
    padding: 20,
    alignItems: "center",
  },
  workerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    marginTop: 70,
    borderColor: "#042630",
    borderWidth: 3,
  },
  workerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 20,
    color: "#666",
    marginBottom: 15,
  },
  workerDescription: {
    fontSize: 18,
    color: "#777",
    marginBottom: 15,
    textAlign: "center",
  },
  ratingContainer: {
    marginBottom: 15,
  },
  map: {
    width: "80%",
    height: 200,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#042630",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: "#042630",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  contactButton: {
    backgroundColor: "#042630",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#042630",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactIcon: {
    color: "#fff",
  },
});

export default WorkerDetailsScreen;

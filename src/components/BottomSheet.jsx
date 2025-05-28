import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons as MDIcon } from "@expo/vector-icons";
import RBSheet from "react-native-raw-bottom-sheet";

export default function BottomSheet() {
  const refStandard = useRef();
  refStandard.current.open();
  const listData = [
    { icon: "insert-drive-file", label: "Document" },
    { icon: "photo-camera", label: "Camera" },
    { icon: "photo", label: "Gallery" },
    { icon: "headset", label: "Audio" },
    { icon: "location-on", label: "Location" },
    { icon: "person", label: "Contact" },
  ];

  const showBottomSheet = () => {
    refStandard.current.open();
  };

  return (
    <View style={styles.container}>
      <RBSheet ref={refStandard} draggable dragOnContent height={330}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Create</Text>
          {listData.map((list, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listButton}
              onPress={() => refStandard.current.close()}
            >
              <MDIcon name={list.icon} style={styles.listIcon} />
              <Text style={styles.listLabel}>{list.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: 150,
    backgroundColor: "#4EB151",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 3,
    margin: 10,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: "#666",
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
});

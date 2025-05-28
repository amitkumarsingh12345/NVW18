import { TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { allConstant } from "@/src/constants/Constant";

export default function show_profile_image() {
  const { image_path } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.imageContainer}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: allConstant.os == "ios" ? 60 : 15,
          left: allConstant.os == "ios" ? 25 : 15,
          padding: 5,
          borderWidth: 1,
        }}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={25} color="#fff" />
      </TouchableOpacity>
      <Image
        source={
          image_path
            ? { uri: image_path }
            : require("../../assets/images/icon.png")
        }
        width={"80%"}
        height={"80%"}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default function Logo2() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://nvwebsoft.com/img/quote.png" }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 120,
  },
});

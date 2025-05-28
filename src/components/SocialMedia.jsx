import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Linking } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { allConstant } from "../constants/Constant";

export default function SocialMedia() {
  const openSocial = (platform) => {
    switch (platform) {
      case "facebook":
        Linking.openURL("https://www.facebook.com/YourPage");
        break;
      case "whatsapp":
        Linking.openURL("https://wa.me/9307949470");
        break;
    }
  };

  return (
    <View style={styles.socialContainer}>
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => openSocial("facebook")}>
          <FontAwesome
            name="facebook-square"
            size={moderateScale(30)}
            color="#4267B2"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openSocial("whatsapp")}>
          <FontAwesome
            name="whatsapp"
            size={moderateScale(30)}
            color="#25D366"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://nvwebsoft.com/")}
        >
          <FontAwesome5
            name="globe"
            size={moderateScale(30)}
            color="#003463"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.instagram.com/nvwebsoft/")
          }
        >
          <FontAwesome5
            name="instagram"
            size={moderateScale(30)}
            color="#003463"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  socialContainer: {
    justifyContent: "space-evenly",
    marginTop: verticalScale(15),
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "#fff",
    padding: moderateScale(10),
    borderRadius: moderateScale(15),
    marginBottom:
      allConstant.os == "ios" ? verticalScale(10) : verticalScale(25),
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  icon: {
    marginHorizontal: scale(10),
    padding: allConstant.os == "ios" ? moderateScale(7) : moderateScale(5),
  },
});

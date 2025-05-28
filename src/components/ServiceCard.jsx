import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { allConstant } from "../constants/Constant";

const { height, width } = Dimensions.get("window");

export default function ServiceCard({ name, icon, id, getDetails }) {
  return (
    <TouchableOpacity onPress={() => getDetails(id)}>
      <View style={serviceCard.container}>
        <Image
          source={{
            uri: `https://nvwebsoft.com/php_api/assets/website_upload/service/${icon}`,
          }}
          height={verticalScale(45)}
          width={scale(45)}
          style={serviceCard.image}
        />
        <Text style={serviceCard.cardText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const serviceCard = StyleSheet.create({
  container: {
    width: allConstant.os == "ios" ? width * 0.443 : width * 0.443,
    height: allConstant.os == "ios" ? height * 0.075 : height * 0.08,
    alignItems: "center",
    padding: moderateScale(10),
    marginBottom:
      allConstant.os == "ios" ? verticalScale(8) : verticalScale(10),
    boxShadow: "0px 0px 1px gray",
    borderRadius: moderateScale(50),
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow:
      "2px 2px 4px rgba(0,0,0,0.2),inset -1px -1px 2px rgba(255,255,255,0.6)",
  },
  cardText: {
    fontSize: allConstant.os == "ios" ? moderateScale(10.5) : moderateScale(9),
    width: "60%",
    fontFamily: "Ubuntu-Bold",
  },
});

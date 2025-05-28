import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { allConstant } from "../constants/Constant";

// (main)/index

const homeScreenStyle = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: allConstant.os == "ios" ? verticalScale(10) : verticalScale(15),
  },
});

export { homeScreenStyle };

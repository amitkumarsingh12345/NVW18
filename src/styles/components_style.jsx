import { StyleSheet } from "react-native";
import { allConstant } from "../constants/Constant";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

// Logo

const logoStyle = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: moderateScale(5),
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(15),
  },
  logo: {
    width: scale("100%"),
    height: verticalScale(50),
  },
});

// Notification Card

const notificationCard = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: scale(16),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: verticalScale(15),
    color: "#333",
    textAlign: "center",
    marginTop: allConstant.os == "ios" ? -30 : verticalScale(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  leftAvatar: {
    backgroundColor: "purple",
    marginRight: scale(10),
  },
  rightAvatar: {
    backgroundColor: "red",
    marginLeft: scale(10),
  },
  text: {
    flex: 1,
    fontSize: moderateScale(14),
    color: "#333",
  },
});

// Bottom Sheet

const bottomSheet = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },

  listContainer: {
    flex: 1,
    padding: moderateScale(25),
    paddingTop: verticalScale(5),
  },
  listTitle: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(5),
    color: "#666",
    fontFamily: "Ubuntu-Medium",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical:
      allConstant.os == "ios" ? verticalScale(3) : verticalScale(5),
  },
  listIcon: {
    fontSize: moderateScale(20),
    color: "#666",
    width: scale(40),
  },
  listLabel: {
    fontSize: allConstant.os == "ios" ? moderateScale(18) : moderateScale(15),
    fontFamily: "Ubuntu-Regular",
    paddingVertical: allConstant.os == "ios" ? 5 : verticalScale(2),
  },
});

export { logoStyle, notificationCard, bottomSheet };

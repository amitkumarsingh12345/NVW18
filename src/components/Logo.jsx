import { Image, View, StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function Logo({ logoName }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    justifyContent: "center",
  },
  logo: {
    // width: scale(250),
    // height: verticalScale(150),
    width: scale(200),
    height: verticalScale(80),
  },
});

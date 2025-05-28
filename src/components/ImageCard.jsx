import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useNavigation } from "expo-router";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

const { height, width } = Dimensions.get("window");

// Shimmer Import
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { allConstant } from "../constants/Constant";

let portfolioData;

export default function ImageCard() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useEffect(() => {
    const getProjectsData = async () => {
      try {
        const result = await axios.post(
          "https://nvwebsoft.com/php_api/api.php/portfolio"
        );
        portfolioData = result.data;
        setProject(result.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after data is fetched
      }
    };
    getProjectsData();
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {isLoading
        ? // Shimmer effect while loading
          Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.card}>
              <ShimmerPlaceholder
                style={styles.image}
                visible={false}
                shimmerColors={["#ebf3ff", "#d1e3ff", "#ebf3ff"]}
                duration={1200}
                LinearGradient={LinearGradient}
              />
              <ShimmerPlaceholder
                style={[
                  styles.cardBody,
                  { width: 40, height: 40, borderRadius: 100, marginTop: 10 },
                ]}
              />
            </View>
          ))
        : // Render actual content after loading
          project?.map((data, index) => (
            <View style={styles.card} key={index}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("portfolio", {
                      portfolio_title: data.portfolio_title,
                      portfolio_img: data.portfolio_img,
                      portfolio_desc: data.portfolio_desc,
                      portfolio_link: data.portfolio_link,
                    })
                  }
                >
                  <Image
                    source={
                      data.portfolio_img
                        ? { uri: data.portfolio_img }
                        : require("../assets/images/icon.png")
                    }
                    resizeMode="stretch"
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("portfolio", {
                    portfolio_title: data.portfolio_title,
                    portfolio_img: data.portfolio_img,
                    portfolio_desc: data.portfolio_desc,
                    portfolio_link: data.portfolio_link,
                  })
                }
              >
                <View style={styles.cardBody}>
                  <View style={styles.textContainer}>
                    <Text style={{ fontFamily: "Ubuntu-Medium", fontSize: 14 }}>
                      {data.portfolio_title}
                    </Text>
                  </View>
                  <Text style={styles.text}>
                    {data.portfolio_desc
                      ?.replace(/<[^>]*>/g, "")
                      .replace(/&quot;/g, '"')
                      .replace(/&amp;/g, "&")
                      .replace(/&lt;/g, "<")
                      .replace(/&gt;/g, ">")
                      .substring(0, 100)}
                    ...
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider}>
                <Text />
              </View>

              <View style={styles.buttonContainer}>
                <Text style={{ fontFamily: "Ubuntu-Light" }}>
                  Show Details {">>"}
                </Text>
                <TouchableOpacity style={styles.button}>
                  <Link
                    href={data.portfolio_link}
                    style={{
                      color: "#fff",
                      fontSize: moderateScale(12),
                      fontFamily: "Ubuntu-Light",
                    }}
                  >
                    Click here
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          ))}
    </ScrollView>
  );
}

export { portfolioData };

const styles = StyleSheet.create({
  container: {
    marginTop: allConstant.os == "ios" ? verticalScale(10) : verticalScale(15),
    flexDirection: "row",
    flexWrap: "no-wrap",
  },
  card: {
    borderRadius: moderateScale(15),
    width: width * 0.75,
    height: allConstant.os == "ios" ? height * 0.38 : height * 0.43,
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    boxShadow: "0px 0px 1px #003463",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginEnd: scale(10),
    padding: moderateScale(10),
    backgroundColor: "#fff",
    boxShadow:
      "2px 2px 4px rgba(0,0,0,0.2),inset -1px -1px 2px rgba(255,255,255,0.6)",
  },
  image: {
    width: width * 0.7,
    height: height * 0.2,
    borderRadius: moderateScale(5),
  },
  title: {
    fontSize: moderateScale(12),
  },
  text: {
    fontSize: moderateScale(12),
    fontFamily: "Ubuntu-Regular",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(80),
  },
  button: {
    backgroundColor: "#003463",
    padding: moderateScale(5),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(15),
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#fff",
    shadowColor: "#003463",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 2,
  },
});

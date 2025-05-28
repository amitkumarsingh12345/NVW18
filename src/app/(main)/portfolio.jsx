import { portfolioData } from "@/src/components/ImageCard";
import { useRoute } from "@react-navigation/native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function PortfolioCard() {
  const [allProjects, setAllProjects] = useState(portfolioData);
  const [findMore, setFindMore] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); // NEW STATE
  const route = useRoute();

  const { portfolio_title, portfolio_img, portfolio_desc, portfolio_link } =
    route.params || {};

  useEffect(() => {
    if (portfolio_title || portfolio_img || portfolio_desc || portfolio_link) {
      setAllProjects([route.params]);
      setFindMore(true);
    }
  }, [route.params]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {allProjects?.length > 0 ? (
        allProjects.map((data, index) => {
          const isExpanded = expandedIndex === index;
          const cleanDesc =
            data.portfolio_desc
              ?.replace(/<[^>]+>/g, "")
              .replace(/&[^;]+;/g, " ") || "No description available.";
          const shortDesc = cleanDesc.slice(0, 100);

          return (
            <View style={styles.card} key={index}>
              <Image
                source={{
                  uri:
                    data.portfolio_img ||
                    "https://nvwebsoft.com/php_api/assets/website_upload/portfolio/serv_15486847773283.png",
                }}
                style={styles.image}
              />
              <View style={styles.cardBody}>
                <Text style={styles.title}>
                  {data.portfolio_title || "Real Estate App"}
                </Text>

                <Text style={styles.description}>
                  {isExpanded
                    ? cleanDesc
                    : shortDesc + (cleanDesc.length > 100 ? "..." : "")}
                </Text>

                {cleanDesc.length > 100 && (
                  <TouchableOpacity
                    onPress={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    <Text style={styles.link}>
                      {isExpanded ? "Read Less <<" : "Read More >>"}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.divider}>
                  <Text />
                </View>

                <View style={styles.buttonContainer}>
                  <Text style={{ fontFamily: "Ubuntu-Regular", fontSize: 13 }}>
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
            </View>
          );
        })
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image source={require("../../assets/images/no_data.png")} />
        </View>
      )}

      {findMore && allProjects?.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setAllProjects(portfolioData);
            setFindMore(false);
          }}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: moderateScale(15),
          }}
        >
          <Text
            style={{
              padding: moderateScale(10),
              fontFamily: "Ubuntu-Regular",
              fontSize: moderateScale(15),
              opacity: 1,
            }}
          >
            Show More Related Porfolioes
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: moderateScale(15),
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowRadius: moderateScale(5),
    shadowOffset: { width: 0, height: 2 },
    marginBottom: verticalScale(15),
    padding: moderateScale(20),
    borderRadius: moderateScale(15),
  },
  image: {
    width: scale("100%"),
    height: verticalScale(200),
    borderRadius: moderateScale(8),
    resizeMode: "stretch",
  },
  cardBody: {
    padding: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(15),
    marginBottom: moderateScale(5),
    fontFamily: "Ubuntu-Medium",
  },
  description: {
    fontSize: moderateScale(13),
    marginBottom: verticalScale(10),
    fontFamily: "Ubuntu-Regular",
  },
  link: {
    color: "#007bff",
    fontSize: moderateScale(13),
    marginTop: verticalScale(5),
    fontFamily: "Ubuntu-Light",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: verticalScale(80),
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
    shadowRadius: 2,
    elevation: 2,
    marginVertical: verticalScale(10),
  },
});

import { allConstant } from "@/src/constants/Constant";
import { AuthContext } from "@/src/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function ServiceDetailsCard() {
  const route = useRoute();
  let search = route?.params?.query || "";

  const [dataDetails, setDataDetails] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [findMore, setFindMore] = useState(true);
  const [id, setId] = useState();
  const [location, setLocation] = useState();
  const navigation = useNavigation();
  const { searchQuery, loading, error } = useContext(AuthContext);

  useEffect(() => {
    setDataDetails(searchQuery);
  }, [searchQuery]);

  // Search Query With Location Start

  useEffect(() => {
    const getLocationHandler = async () => {
      const location = await AsyncStorage.getItem("user_location");
      const user_id = await AsyncStorage.getItem("user_id");
      setId(user_id);
      setLocation(location);
    };
    getLocationHandler();
  }, []);

  useEffect(() => {
    const postSearchDetail = async () => {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("location", location);
      formData.append("service_id", search);

      const result = searchQuery?.filter(
        (data) =>
          data.service_menu_id?.toLowerCase().includes(search.toLowerCase()) ||
          data.service_name?.toLowerCase().includes(search.toLowerCase()) ||
          data.description?.toLowerCase().includes(search.toLowerCase())
      );
      setDataDetails(result);

      try {
        const response = await axios.post(
          "https://nvwebsoft.com/php_api/api.php/location_user_service",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response from PHP API:", response.data);
      } catch (err) {
        console.error("Error posting search detail:", err);
      }
    };

    postSearchDetail();
  }, [search, location, id]);

  // Search Query With Location End

  const getDetailsHandler = (name) => {
    navigation.navigate("contact", { name: name });
    Keyboard.dismiss();
  };

  const toggleDescription = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems[item.service_menu_id];
    const shortDescription =
      item.description.length > 100
        ? item.description.substring(0, 100) + "..."
        : item.description;

    return (
      <>
        <View style={styles.card}>
          <Image
            source={{
              uri: `https://nvwebsoft.com/php_api/assets/website_upload/service/${item.service_img}`,
            }}
            resizeMode="stretch"
            style={styles.image}
          />
          <View style={styles.cardBody}>
            <Text style={styles.title}>{item.service_name}</Text>
            <Text style={styles.text}>
              {isExpanded ? item.description : shortDescription}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: verticalScale(30),
              }}
            >
              {item.description.length > 100 && (
                <Text
                  style={styles.link}
                  onPress={() => toggleDescription(item.service_menu_id)}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => getDetailsHandler(item.service_name)}
                style={{
                  backgroundColor: "#49B1C5",
                  borderRadius: moderateScale(50),
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    padding: allConstant.os == "ios" ? 10 : moderateScale(8),
                    fontSize: moderateScale(12),
                    paddingHorizontal: scale(11),
                    fontFamily: "Ubuntu-Regular",
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  };

  if (loading) {
    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={[1, 2, 3, 4]}
        keyExtractor={(item) => item.toString()}
        renderItem={() => (
          <View style={styles.card}>
            <ShimmerPlaceholder
              style={styles.image}
              shimmerColors={["#e1e9ee", "#f2f8fc", "#e1e9ee"]}
            />
            <View style={styles.cardBody}>
              <ShimmerPlaceholder
                style={{ width: "70%", height: 20, marginBottom: 10 }}
              />
              <ShimmerPlaceholder style={{ width: "90%", height: 14 }} />
            </View>
          </View>
        )}
      />
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { padding: 20 }]}>
        <Text style={{ fontSize: 16, color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  if (!dataDetails.length) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Image
            source={require("../../assets/images/no_data.png")}
            resizeMode="contain"
            style={{ height: verticalScale("70%"), width: scale("70%") }}
          />
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Image
              source={require("../../assets/images/no_data.png")}
              style={{ width: 150, height: 150, resizeMode: "contain" }}
            />
            <Text style={{ paddingVertical: 50, fontSize: 20, color: "#555" }}>
              Service Not Found
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        data={dataDetails}
        keyExtractor={(item) => item.service_menu_id.toString()}
        renderItem={renderItem}
      />
      {/* Show More Services */}
      {search && searchQuery?.length != dataDetails?.length && (
        <TouchableOpacity
          onPress={() => {
            setDataDetails(searchQuery);
            setFindMore(false);
          }}
          style={{
            alignSelf: "center",
            backgroundColor: "#49B1C5",
            width: scale(310),
            borderRadius: moderateScale(15),
            paddingVertical: verticalScale(10),
            alignItems: "center",
            opacity: 0.8,
            paddingHorizontal: scale(20),
            marginBottom: allConstant.os === "ios" ? 18 : 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Ubuntu-Regular",
              fontSize: moderateScale(15),
              color: "#fff",
            }}
          >
            Show More Services
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(15),
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(15),
    overflow: "hidden",
  },
  image: {
    width: scale("100%"),
    height: verticalScale(250),
    backgroundColor: "#ccc",
  },
  cardBody: {
    padding: moderateScale(15),
  },
  title: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(5),
    fontFamily: "Ubuntu-Medium",
  },
  text: {
    fontSize: moderateScale(14),
    color: "#555",
    fontFamily: "Ubuntu-Regular",
  },
  link: {
    color: "#49B1C5",
    fontSize: moderateScale(14),
    marginTop: verticalScale(10),
    fontFamily: "Ubuntu-Regular",
  },
});

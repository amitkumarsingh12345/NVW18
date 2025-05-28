import {
  View,
  ScrollView,
  Dimensions,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ServiceCard from "@/src/components/ServiceCard";
import { homeScreenStyle } from "@/src/styles/pages_style";
import { allConstant } from "@/src/constants/Constant";
import { useNavigation } from "expo-router";
import ImageCard from "@/src/components/ImageCard";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { Ionicons } from "@expo/vector-icons";
import SocialMedia from "@/src/components/SocialMedia";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { usePathname } from "expo-router";
import TinderSlider from "@/src/components/TinderSlider";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { AuthContext } from "@/src/context/AuthContext";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const pathname = usePathname();
  const { findService } = useContext(AuthContext);

  const getServicesData = async () => {
    try {
      const result = await findService();
      setService(result.data);
    } catch (error) {
      console.error("Error fetching service data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getServicesData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getServicesData();
  };

  const getDetailsHandler = (name) => {
    Keyboard.dismiss();
    navigation.navigate("services", { query: name });
    setSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === "Enter") {
      Keyboard.dismiss();
      navigation.navigate("services", { query: search });
      setSearch("");
    }
  };

  // Back Button Start ----------------

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (pathname === "/home" || pathname === "/login") {
          BackHandler.exitApp();
        } else {
          router.replace("/(main)/home");
        }
        return true;
      }
    );

    return () => backHandler.remove();
  }, [pathname]);

  // Back Button End ----------------#f0f4ff

  return (
    <ScrollView
      style={{
        flex: 1,
        // backgroundColor: "#fff",
        flexDirection: "column",
        padding: moderateScale(15),
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          marginBottom: verticalScale(10),
          paddingHorizontal: scale(15),
          borderRadius: moderateScale(50),
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          marginTop: verticalScale(-5),
          boxShadow:
            "2px 2px 4px rgba(0,0,0,0.2),inset -1px -1px 2px rgba(255,255,255,0.6)",
        }}
      >
        <TouchableOpacity onPress={() => getDetailsHandler(search)}>
          <Ionicons name="search" size={moderateScale(20)} color="gray" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search services..."
          placeholderTextColor="#888"
          value={search}
          onKeyPress={handleKeyPress}
          onChangeText={(value) => setSearch(value)}
          keyboardType="default"
          returnKeyType="search"
          onSubmitEditing={() => getDetailsHandler(search)}
          style={{
            flex: 1,
            marginLeft: scale(10),
            fontSize: moderateScale(16),
            color: "#333",
            fontFamily: "Ubuntu-Regular",
            height:
              allConstant.os == "ios" ? verticalScale(50) : verticalScale(55),
          }}
        />

        <TouchableOpacity onPress={() => setSearch("")}>
          <Ionicons name="close-circle" size={moderateScale(20)} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Carousel Section */}
      {/* 
      <CarouselSlider /> */}

      <TinderSlider />

      {/* Carousel Section */}

      {/* Services Section Start*/}

      {service?.length > 0 && (
        <View
          style={{
            justifyContent: "space-between",

            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginTop:
                allConstant.os == "ios" ? verticalScale(5) : verticalScale(15),
              fontSize: moderateScale(18),
              fontFamily: "Ubuntu-Medium",
            }}
          >
            NVW Services
          </Text>
          <MaterialIcons
            name="double-arrow"
            size={moderateScale(14)}
            fontWeight={moderateScale(400)}
            style={{
              marginTop:
                allConstant.os == "ios" ? verticalScale(5) : verticalScale(15),
              fontFamily: "Ubuntu-Medium",
            }}
          />
        </View>
      )}

      <View style={homeScreenStyle.cardContainer}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <View
                key={index}
                style={{
                  width: width * 0.443,
                  height: height * 0.08,
                  alignItems: "center",
                  padding: 10,
                  marginBottom: 10,
                  boxShadow: "0px 0px 1px gray",
                  borderRadius: 50,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ShimmerPlaceholder
                  visible={false}
                  shimmerColors={["#ebf3ff", "#d1e3ff", "#ebf3ff"]}
                  duration={4800}
                  LinearGradient={LinearGradient}
                />
              </View>
            ))
          : service?.map((data) => (
              <ServiceCard
                key={data.service_menu_id}
                id={data.service_menu_id}
                name={data.service_menu_name}
                icon={data.service_icon}
                status={data.status}
                getDetails={getDetailsHandler}
              />
            ))}
      </View>

      {/* Services Section End*/}

      {/* Projects Section Start*/}
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginTop: verticalScale(15),
            fontSize: moderateScale(18),
            fontFamily: "Ubuntu-Medium",
          }}
        >
          NVW Projects
        </Text>
        <MaterialIcons
          name="double-arrow"
          size={moderateScale(14)}
          style={{
            marginTop: verticalScale(15),
            fontFamily: "Ubuntu-Bold",
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <ImageCard />
      </View>

      {/* Projects Section End*/}

      {/* About Section Start*/}

      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginTop:
              allConstant.os == "ios" ? verticalScale(25) : verticalScale(25),
            fontSize: moderateScale(18),
            fontFamily: "Ubuntu-Medium",
          }}
        >
          NVW About us
        </Text>
        <MaterialIcons
          name="double-arrow"
          size={moderateScale(14)}
          style={{
            marginTop:
              allConstant.os == "ios" ? verticalScale(20) : verticalScale(25),
          }}
        />
      </View>
      <View>
        <Text
          style={{
            marginTop: verticalScale(10),
            fontSize: moderateScale(13),
            fontFamily: "Ubuntu-Regular",
            backgroundColor: "#fff",
            padding: moderateScale(10),
            borderRadius: moderateScale(15),
          }}
        >
          Transforming Ideas into Digital Reality — NV Websoft Software
          Solutions Specializes in Cutting-Edge Web, App, and Custom Software
          Development for Businesses Ready to Scale and Innovate.
        </Text>
      </View>

      {/* About Section End*/}

      {/* Contact Section Start*/}

      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginTop:
              allConstant.os == "ios" ? verticalScale(20) : verticalScale(25),
            fontSize: moderateScale(18),
            fontFamily: "Ubuntu-Medium",
          }}
        >
          Contact With us
        </Text>

        <MaterialIcons
          name="double-arrow"
          size={moderateScale(14)}
          style={{
            marginTop:
              allConstant.os == "ios" ? verticalScale(20) : verticalScale(25),
          }}
        />
      </View>
      <SocialMedia />

      {/* Contact Section End*/}
    </ScrollView>
  );
}

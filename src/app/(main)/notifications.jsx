import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { allConstant } from "@/src/constants/Constant";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { AuthContext } from "@/src/context/AuthContext";

export default function NotificationCard() {
  const [notifications, setNotifications] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null); // For toggling expanded item
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const insets = useSafeAreaInsets();
  const { findNotification } = useContext(AuthContext);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await findNotification();
        setNotifications(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications. Please try again later.");
        setLoading(false); // Stop loading even if there is an error
      }
    };

    getNotifications();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Loading state: Show spinner while data is being fetched
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Error state: Show error message if data fetching fails
  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginBottom: verticalScale(10),
          marginTop: allConstant.os == "ios" && -50,
        }}
      >
        <Text
          style={{
            fontWeight: moderateScale(500),
            marginTop: verticalScale(20),
            fontSize: moderateScale(18),
            fontFamily: "Ubuntu-Medium",
          }}
        >
          Notifications
        </Text>
        <MaterialIcons
          name="double-arrow"
          size={moderateScale(15)}
          color={"black"}
          style={{
            marginTop: verticalScale(20),
            fontFamily: "Ubuntu-Light",
          }}
        />
      </View>

      {notifications?.length > 0 ? (
        notifications.map((data, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <TouchableOpacity key={index} onPress={() => toggleExpand(index)}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(auth)/showimage",
                      params: { image_path: data.notification_img },
                    })
                  }
                >
                  <Image
                    source={
                      data.notification_img
                        ? { uri: data.notification_img }
                        : require("../../assets/images/icon.png")
                    }
                    style={styles.imageAvatar}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Ubuntu-Regular",
                      marginBottom: verticalScale(4),
                    }}
                  >
                    {data.title}
                  </Text>
                  <Text style={styles.text}>
                    {isExpanded
                      ? data.description
                      : `${data.description?.substring(0, 30)}...`}
                  </Text>
                </View>
                <Text style={styles.timeText}>{data.sub_date}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Image
          source={require("../../assets/images/no_data.png")}
          resizeMode="contain"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: "Ubuntu-Regular",
    padding: moderateScale(10),
    marginTop: allConstant.os == "ios" && -40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: moderateScale(10),
    marginVertical: verticalScale(5),
    borderRadius: moderateScale(8),
  },
  text: {
    fontSize: moderateScale(10),
    color: "#333",
    fontFamily: "Ubuntu-Regular",
    opacity: 0.9,
  },
  imageAvatar: {
    width: allConstant.os == "ios" ? 50 : 45,
    height: allConstant.os == "ios" ? 50 : 45,
    borderRadius: moderateScale(22.5),
    marginRight: scale(10),
  },
  timeText: {
    fontSize: moderateScale(12),
    color: "#888",
    marginLeft: scale(10),
    alignSelf: "center",
    fontFamily: "Ubuntu-Regular",
  },
  errorText: {
    fontSize: moderateScale(16),
    color: "red",
    textAlign: "center",
    marginTop: verticalScale(20),
  },
});

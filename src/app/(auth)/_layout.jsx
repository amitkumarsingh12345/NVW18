import { Stack, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, MaterialIcons as MDIcon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale, scale } from "react-native-size-matters";

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Check User Login or Not Start

  useEffect(() => {
    const checkIsLogin = async () => {
      const user_id = await AsyncStorage.getItem("user_id");

      if (user_id) {
        navigation.push("/(main)/home");
      }
    };
    checkIsLogin();
  }, []);

  // Check User Login or Not End

  // Proper case
  const toTitleCase = (str) => {
    return str
      .substring(1)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          height: 200,
        },
        headerTitle: () => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back"
                size={moderateScale(20)}
                color="#003463"
                style={{
                  padding: moderateScale(5),
                  paddingHorizontal: scale(10),
                }}
              />
            </TouchableOpacity>

            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontFamily: "Ubuntu-Medium",
                  color: "#003463",
                }}
              >
                {toTitleCase(pathname)}
              </Text>
            </View>
          </View>
        ),
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="careers" options={{ headerShown: true }} />
      <Stack.Screen name="quotation" options={{ headerShown: true }} />
      <Stack.Screen name="showimage" options={{ headerShown: false }} />
    </Stack>
  );
}

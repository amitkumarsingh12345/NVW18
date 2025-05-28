import React, { useCallback, useContext, useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext, AuthProvider } from "../context/AuthContext";

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

function RootLayout() {
  const [isLogin, setIsLogin] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const { findServiceDetail } = useContext(AuthContext);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "Ubuntu-Regular": require("../assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
    "Ubuntu-Bold": require("../assets/fonts/Ubuntu/Ubuntu-Bold.ttf"),
    "Ubuntu-Italic": require("../assets/fonts/Ubuntu/Ubuntu-Italic.ttf"),
    "Ubuntu-Light": require("../assets/fonts/Ubuntu/Ubuntu-Light.ttf"),
    "Ubuntu-Medium": require("../assets/fonts/Ubuntu/Ubuntu-Medium.ttf"),
  });

  // Callback for when the root view is laid out
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && appReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appReady]);

  // Check login status and prepare app
  useEffect(() => {
    const prepareApp = async () => {
      try {
        const user_id = await AsyncStorage.getItem("user_id");
        findServiceDetail();
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLogin(!!user_id);
      } catch (error) {
        console.warn("Error loading app:", error);
      } finally {
        setAppReady(true);
      }
    };

    prepareApp();
  }, []);

  // Don't render anything until fonts are loaded and app is ready
  if (!fontsLoaded || !appReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }} />
      {isLogin ? (
        <Redirect href={"/(main)/home"} />
      ) : (
        <Redirect href={"/(auth)/login"} />
      )}
    </View>
  );
}

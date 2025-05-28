import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Alert,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CurrentLocation from "@/src/components/CurrentLocation";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as Device from "expo-device";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  // Get & Set Token Start-----------
  const findTokenHandler = async (reg_id) => {
    const id = Device.osInternalBuildId || Device.osBuildId || "unknown";
    setDeviceId(id);
    const payload = {
      token_id: id,
      registration_id: reg_id,
    };

    const response = await axios.post(
      "https://nvwebsoft.com/php_api/api.php/token",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const getUserProfile = async (id) => {
    const url = "https://nvwebsoft.com/php_api/api.php/get_profile";
    const formData = new FormData();
    formData.append("registration_id", id);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      findTokenHandler(id);

      return response.data;
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!identifier) {
      Alert.alert("Error", "Please enter your email or mobile number");
      return;
    }

    const isMobile = !identifier.includes("@");

    // Mobile number validation (Indian format - 10 digits starting with 6-9)
    if (isMobile) {
      const mobileRegex = /^[6-9]\d{9}$/;
      if (!mobileRegex.test(identifier)) {
        Alert.alert("Error", "Invalid mobile number format");
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload = {
        [isMobile ? "mobile_no" : "email"]: identifier,
      };

      const response = await axios.post(
        "https://nvwebsoft.com/php_api/api.php/log_in",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        const data = await getUserProfile(response.data.message);

        if (data) {
          await AsyncStorage.setItem("user_profile", JSON.stringify(data));
        }
      }

      await AsyncStorage.setItem(
        "user_id",
        JSON.stringify(response.data.message)
      );

      const user_id = await AsyncStorage.getItem("user_id");

      if (response.status == 200) {
        Alert.alert("Success", "Login successful");
        router.replace("/(main)/home");
      } else {
        Alert.alert("Error", response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network request failed. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/icon.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CurrentLocation />

          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="App logo"
              accessibilityRole="image"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Welcome to NVW</Text>
            <Text style={styles.subtitle}>Login with Email or Phone</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or Phone Number"
                placeholderTextColor="#A0AEC0"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: scale(30),
    paddingBottom: verticalScale(40),
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  logo: {
    width: scale(150),
    height: verticalScale(150),
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: moderateScale(20),
    padding: moderateScale(25),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: "Ubuntu-Medium",
    marginBottom: verticalScale(5),
    color: "#2D3748",
    textAlign: "center",
  },
  subtitle: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(30),
    color: "#718096",
    fontFamily: "Ubuntu-Regular",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  input: {
    width: "100%",
    height: verticalScale(55),
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(20),
    backgroundColor: "#F8FAFC",
    color: "#2D3748",
    fontFamily: "Ubuntu-Regular",
    fontSize: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButton: {
    width: "100%",
    height: verticalScale(55),
    backgroundColor: "#003463",
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#003463",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "Ubuntu-Medium",
    letterSpacing: 0.5,
  },
});

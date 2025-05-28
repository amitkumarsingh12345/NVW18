import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { allConstant } from "@/src/constants/Constant";
import { router } from "expo-router";

const ProfileScreen = () => {
  const [loginEmail, setloginEmail] = useState(null);
  const [loginMobile, setloginMobile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    registration_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadProfile = async () => {
    try {
      const profileString = await AsyncStorage.getItem("user_profile");
      if (profileString) {
        const user_profile = JSON.parse(profileString);

        if (user_profile.email) {
          setloginEmail(user_profile.email);
        } else if (user_profile.mobile_no) {
          setloginMobile(user_profile.mobile_no);
        }

        setFormData({
          name: user_profile.name || "",
          email: user_profile.email || "",
          mobile_no: user_profile.mobile_no || "",
          address: user_profile.address || "",
          registration_id: user_profile.registration_id || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await loadProfile();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.mobile_no) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setIsUpdating(true);
      const formDataToSend = new FormData();
      formDataToSend.append("registration_id", formData.registration_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobile_no", formData.mobile_no);
      formDataToSend.append("address", formData.address || "");

      const response = await axios.post(
        "https://nvwebsoft.com/php_api/api.php/update_profile",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.message == true) {
        const updatedProfile = { ...formData };
        await AsyncStorage.setItem(
          "user_profile",
          JSON.stringify(updatedProfile)
        );
        setFormData(updatedProfile);
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Failed to update profile"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "An error occurred while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#49B1C5" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            marginEnd: "auto",
            padding: moderateScale(5),
            marginStart: scale(10),
            marginTop:
              allConstant.os == "ios" ? verticalScale(40) : verticalScale(10),
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons
            name="arrow-back"
            size={moderateScale(25)}
            color="#003463"
          />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/images/profile.png")}
            resizeMode="contain"
            style={styles.avatar}
          />
        </View>
        <Text style={styles.title}>Profile Information</Text>
        <Text style={styles.subtitle}>Update your personal details</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="person-outline"
            size={moderateScale(22)}
            color="#6b7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={formData?.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder="Full Name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="alternate-email"
            size={moderateScale(20)}
            color="#6b7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, !formData.email && styles.disabledInput]}
            value={formData?.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loginEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={moderateScale(22)}
            color="#6b7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, !formData.mobile_no && styles.disabledInput]}
            value={formData?.mobile_no}
            onChangeText={(text) => handleChange("mobile_no", text)}
            placeholder="Mobile Number"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            editable={!loginMobile}
          />
        </View>

        <View style={[styles.inputContainer, styles.multilineContainer]}>
          <Ionicons
            name="location-outline"
            size={moderateScale(22)}
            color="#6b7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={formData?.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Full Address"
            placeholderTextColor="#9ca3af"
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.saveButtonText}>Update Profile</Text>
              <Ionicons
                name="arrow-forward"
                size={moderateScale(18)}
                color="white"
                style={styles.buttonIcon}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingBottom: verticalScale(25),
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),

    marginBottom: verticalScale(10),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarContainer: {
    position: "relative",
    marginBottom: verticalScale(15),
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: moderateScale(60),
    borderWidth: moderateScale(3),
    borderColor: "#e2e8f0",
  },

  title: {
    fontSize: moderateScale(25),
    fontFamily: "Ubuntu-Regular",
    color: "#003463",
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontFamily: "Ubuntu-Light",
    color: "#64748b",
  },
  formContainer: {
    paddingHorizontal: moderateScale(25),
    marginTop: verticalScale(15),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(15),
    paddingVertical:
      allConstant.os === "ios" ? verticalScale(12) : verticalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
        borderWidth: 0.5,
        borderColor: "#e2e8f0",
      },
    }),
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: verticalScale(15),
  },
  inputIcon: {
    marginRight: moderateScale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: "Ubuntu-Regular",
    color: "#334155",
    paddingVertical: verticalScale(5),
  },
  disabledInput: {
    color: "#9ca3af",
  },
  multilineInput: {
    height: verticalScale(80),
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#003463",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginTop: verticalScale(10),
    ...Platform.select({
      ios: {
        shadowColor: "#49B1C5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: moderateScale(18),
    fontFamily: "Ubuntu-Medium",
  },
  buttonIcon: {
    marginLeft: moderateScale(10),
  },
});

export default ProfileScreen;

import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import {
  Text,
  TextInput,
  RadioButton,
  Checkbox,
  Button,
} from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function QuotationForm() {
  const [identity, setIdentity] = useState("");
  const [identityDesc, setIdentityDesc] = useState("");
  const [services, setServices] = useState({
    website: false,
    androidApp: false,
    software: false,
    other: false,
  });
  const [serviceDesc, setServiceDesc] = useState("");
  const [email, setEmail] = useState("");
  const userId = "123"; // Replace with actual user_id from AsyncStorage or context if needed

  useEffect(() => {
    const getProfile = async () => {
      const user_profile = await AsyncStorage.getItem("user_profile");
      const user_details = JSON.parse(user_profile);
      if (user_details?.email) {
        setEmail(user_details.email);
      }
    };
    getProfile();
  }, []);

  const clearForm = () => {
    setIdentity("");
    setIdentityDesc("");
    setServices({
      website: false,
      androidApp: false,
      software: false,
      other: false,
    });
    setServiceDesc("");
    setEmail("");
  };

  const sendForm = async () => {
    const selectedServices = Object.keys(services).filter(
      (key) => services[key]
    );

    if (!identity.trim()) {
      Alert.alert("Validation Error", "Please select who you are.");
      return;
    }

    if (!identityDesc.trim()) {
      Alert.alert("Validation Error", "Please describe who you are.");
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert("Validation Error", "Please select at least one service.");
      return;
    }

    if (!serviceDesc.trim()) {
      Alert.alert("Validation Error", "Please describe the product/service.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "https://nvwebsoft.com/php_api/api.php/quotation",
        new URLSearchParams({
          who_you_are: identity,
          products: selectedServices.join(", "),
          website_page: identityDesc,
          descr: serviceDesc,
          email: email,
          user_id: userId,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Response:", response?.data?.message === "done");
      Alert.alert("Success", "Quotation request sent successfully!");
      clearForm();
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to send the quotation request.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About You</Text>

        <Text style={styles.label}>Who are you?</Text>
        <RadioButton.Group onValueChange={setIdentity} value={identity}>
          {["Business/Org", "College/School", "Firm", "Other"].map((option) => (
            <View key={option} style={styles.radioOption}>
              <View
                style={{
                  borderWidth: 2,
                  width: 20,
                  height: 20,
                  justifyContent: "center",
                  borderRadius: 100,
                  alignItems: "center",
                  borderColor: "gray",
                  marginEnd: verticalScale(10),
                }}
              >
                <RadioButton
                  value={option}
                  color="#003463"
                  uncheckedColor="#7f8c8d"
                />
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <TextInput
          label="Describe who you are"
          value={identityDesc}
          onChangeText={setIdentityDesc}
          multiline
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#003463" } }}
          outlineColor="#ddd"
          activeOutlineColor="#003463"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Details</Text>

        <Text style={styles.label}>Product/Service you want</Text>
        {[
          { key: "website", label: "Website" },
          { key: "androidApp", label: "Android App" },
          { key: "software", label: "Software" },
          { key: "other", label: "Other" },
        ].map(({ key, label }) => (
          <View key={key} style={styles.checkboxContainer}>
            <View
              style={{
                borderWidth: 2,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "gray",
                marginEnd: verticalScale(10),
              }}
            >
              <Checkbox
                status={services[key] ? "checked" : "unchecked"}
                onPress={() =>
                  setServices((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                color="#003463"
                uncheckedColor="#7f8c8d"
                style={{ borderBottomWidth: 5 }}
              />
            </View>
            <Text style={styles.optionText}>{label}</Text>
          </View>
        ))}

        <TextInput
          label="Describe the product/service"
          value={serviceDesc}
          onChangeText={setServiceDesc}
          multiline
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#003463" } }}
          outlineColor="#ddd"
          activeOutlineColor="#003463"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: "#003463" } }}
          outlineColor="#ddd"
          activeOutlineColor="#003463"
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={clearForm}
          style={[styles.button, styles.clearButton]}
          labelStyle={styles.buttonText}
        >
          Clear
        </Button>
        <Button
          mode="contained"
          onPress={sendForm}
          style={styles.button}
          labelStyle={styles.buttonText}
          contentStyle={styles.buttonContent}
        >
          Send Request
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: moderateScale(20),
  },
  section: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#003463",
    marginBottom: verticalScale(16),
    fontFamily: "Ubuntu-Medium",
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    marginBottom: verticalScale(8),
    fontSize: moderateScale(14),
    color: "#34495e",
    fontFamily: "Ubuntu-Medium",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(4),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(4),
  },
  optionText: {
    fontFamily: "Ubuntu-Regular",
    color: "#2c3e50",
    fontSize: moderateScale(14),
  },
  input: {
    marginVertical: verticalScale(10),
    backgroundColor: "transparent",
    fontFamily: "Ubuntu-Regular",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(24),
    paddingHorizontal: moderateScale(8),
  },
  button: {
    flex: 0.48,
    borderRadius: moderateScale(8),
    backgroundColor: "#003463",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButton: {
    backgroundColor: "#003463",
  },
  buttonText: {
    fontFamily: "Ubuntu-Medium",
    fontSize: moderateScale(14),
    color: "#fff",
  },
  buttonContent: {
    height: verticalScale(48),
  },
});

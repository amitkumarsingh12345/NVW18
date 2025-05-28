import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { allConstant } from "@/src/constants/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

export default function CareerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    experience: "",
    esalary: "",
    qualification: "",
    job: "",
    cemp: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug form state
  useEffect(() => {
    console.log("Form state updated:", {
      ...form,
      resume: form.resume
        ? {
            name: form.resume.name,
            size: form.resume.size,
            type: form.resume.type,
          }
        : null,
    });
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      if (result.assets?.length > 0) {
        const file = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(file.uri);

        if (!fileInfo.exists) {
          throw new Error("File does not exist");
        }

        // Check file size (e.g., 5MB limit)
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("Error", "File size should be less than 5MB");
          return;
        }

        setForm((prev) => ({
          ...prev,
          resume: {
            uri: file.uri,
            name: file.name || `resume_${Date.now()}`,
            type: file.mimeType || "application/octet-stream",
            size: fileInfo.size,
          },
        }));
      }
    } catch (err) {
      console.error("Document picker error:", err);
      Alert.alert("Error", "Could not pick a resume file. Please try again.");
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "name", label: "Name" },
      { field: "email", label: "Email" },
      { field: "contact", label: "Contact" },
      { field: "address", label: "Address" },
      { field: "experience", label: "Experience" },
      { field: "esalary", label: "Expected Salary" },
      { field: "qualification", label: "Qualification" },
      { field: "job", label: "Job Title" },
      { field: "cemp", label: "Current Employer" },
    ];

    const missingFields = requiredFields
      .filter(({ field }) => !form[field]?.trim())
      .map(({ label }) => label);

    if (!form.resume || !form.resume.uri) {
      missingFields.push("Resume");
    }

    // Email validation
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please complete: ${missingFields.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields except resume
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "resume" && value) {
          formData.append(key, value);
        }
      });

      // Append resume file
      if (form.resume) {
        formData.append("resume", {
          uri: form.resume.uri,
          name: form.resume.name,
          type: form.resume.type,
        });
      }

      const response = await axios.post(
        "https://nvwebsoft.com/php_api/api.php/career",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 10000, // 30 seconds timeout
        }
      );

      if (response.data?.success) {
        Alert.alert("Success", "Application submitted successfully!");
        // Reset form
        setForm({
          name: "",
          email: "",
          contact: "",
          address: "",
          experience: "",
          esalary: "",
          qualification: "",
          job: "",
          cemp: "",
          resume: null,
        });
      } else {
        throw new Error(response.data?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "Submission failed. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setForm({
        name: "",
        email: "",
        contact: "",
        address: "",
        experience: "",
        esalary: "",
        qualification: "",
        job: "",
        cemp: "",
        resume: null,
      });

      Alert.alert("Success", "Application submitted successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find User Details Start-------------

  useEffect(() => {
    const getProfile = async () => {
      const user_profile = await AsyncStorage.getItem("user_profile");
      const user_details = JSON.parse(user_profile);

      if (user_details) {
        setForm({
          name: user_details.name,
          email: user_details.email,
          contact: user_details.mobile_no,
          address: "",
          experience: "",
          esalary: "",
          qualification: "",
          job: "",
          cemp: "",
          resume: null,
        });
      }
    };
    getProfile();
  }, []);

  // Find User Details End -------------

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          allConstant.os === "ios" ? styles.iosPadding : styles.androidPadding,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {[
            { label: "Full Name", key: "name", icon: "person" },
            {
              label: "Email",
              key: "email",
              keyboard: "email-address",
              icon: "mail",
            },
            {
              label: "Contact Number",
              key: "contact",
              keyboard: "phone-pad",
              icon: "call",
            },
            {
              label: "Address",
              key: "address",
              multiline: true,
              icon: "location",
            },
            {
              label: "Experience (Years)",
              key: "experience",
              keyboard: "numeric",
              icon: "time",
            },
            {
              label: "Expected Salary",
              key: "esalary",
              keyboard: "numeric",
              icon: "cash",
            },
            { label: "Qualification", key: "qualification", icon: "school" },
            { label: "Job Title", key: "job", icon: "briefcase" },
            { label: "Current Employer", key: "cemp", icon: "business" },
          ].map(({ label, key, keyboard, multiline, icon }) => (
            <View key={key} style={styles.inputContainer}>
              <Ionicons
                name={icon}
                size={moderateScale(20)}
                color="#003463"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  multiline && {
                    height: verticalScale(100),
                    textAlignVertical: "top",
                  },
                ]}
                placeholder={label}
                placeholderTextColor="#888"
                value={form[key]}
                onChangeText={(value) => handleChange(key, value)}
                keyboardType={keyboard || "default"}
                multiline={multiline}
                editable={!isSubmitting}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.resumeButton, form.resume && styles.resumeSelected]}
            onPress={pickResume}
            disabled={isSubmitting}
          >
            <Ionicons
              name="document-attach"
              size={moderateScale(24)}
              color={form.resume ? "#fff" : "#003463"}
            />
            <Text
              style={[
                styles.resumeText,
                form.resume && styles.resumeSelectedText,
              ]}
            >
              {form.resume
                ? `Resume: ${form.resume.name.substring(
                    0,
                    10
                  )}... (${Math.round(form.resume.size / 1024)} KB)`
                : "Upload Resume (PDF/DOC/DOCX)"}
            </Text>
            {form.resume && (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(20)}
                color="#fff"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Submit Application</Text>
                <Ionicons
                  name="send-sharp"
                  size={moderateScale(20)}
                  color="#fff"
                  style={styles.arrowIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    margin: moderateScale(10),
    marginVertical: verticalScale(0),
    boxShadow: "0px 0px 1px gray",
  },
  iosPadding: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
  },
  androidPadding: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },

  formContainer: {
    paddingHorizontal: moderateScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    marginBottom: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    height: verticalScale(50),
    fontSize: moderateScale(16),
    fontFamily: "Ubuntu-Regular",
    color: "#333",
    paddingVertical: moderateScale(15),
  },
  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(25),
    borderWidth: 1,
    borderColor: "#003463",
    borderStyle: "dashed",
    justifyContent: "center",
  },
  resumeSelected: {
    backgroundColor: "#003463",
    borderStyle: "solid",
  },
  resumeText: {
    fontSize: moderateScale(16),
    fontFamily: "Ubuntu-Medium",
    color: "#003463",
    marginLeft: moderateScale(10),
  },
  resumeSelectedText: {
    color: "#fff",
  },
  checkIcon: {
    marginLeft: moderateScale(10),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003463",
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(10),
    shadowColor: "#003463",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "Ubuntu-Medium",
  },
  arrowIcon: {
    marginLeft: moderateScale(10),
  },
});

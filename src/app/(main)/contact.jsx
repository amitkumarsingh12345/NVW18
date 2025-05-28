import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Image } from "react-native";

export default function ContactForm() {
  const [loginEmail, setloginEmail] = useState(null);
  const [loginMobile, setloginMobile] = useState(null);
  const route = useRoute();
  const subjectName = route?.params?.name || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile_no: "",
    subject: "",
    query: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, email, mobile_no, subject, query } = form;

    if (!subject || !query) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://nvwebsoft.com/php_api/api.php/enquiry",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Simulate a delay for the spinner (you can remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (response.status === 200) {
        Alert.alert("Success", "Your query has been submitted!");
        console.log("Server Response:", response.data);

        // Clear the form
        setForm({
          name: "",
          email: loginEmail ? loginEmail : "",
          mobile_no: loginMobile ? loginMobile : "",
          subject: "",
          query: "",
        });
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
        console.error("Server Error:", response);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to submit. Please check your connection or try again later."
      );
      console.error("Axios Error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSocial = (platform) => {
    switch (platform) {
      case "facebook":
        Linking.openURL("https://www.facebook.com/YourPage");
        break;
      case "whatsapp":
        Linking.openURL("https://wa.me/9307949470");
        break;
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      const user_profile = await AsyncStorage.getItem("user_profile");
      const user_details = JSON.parse(user_profile);

      if (user_details.email) {
        setloginEmail(user_details.email);
      } else if (user_details.mobile_no) {
        setloginMobile(user_details.mobile_no);
      }

      if (user_details) {
        setForm({
          name: user_details.name,
          email: user_details.email,
          mobile_no: user_details.mobile_no,
          subject: subjectName ? subjectName : "",
          query: "",
        });
      }
    };
    getProfile();
  }, [subjectName]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Contact Us</Text>
      </View> */}

      <View style={styles.avatarContainer}>
        <Image
          source={require("../../assets/images/message.png")}
          resizeMode="contain"
          style={styles.avatar}
        />
      </View>
      <View style={styles.formContainer}>
        {[
          // { label: "Name", key: "name", icon: "person" },
          // {
          //   label: "Email",
          //   key: "email",
          //   keyboard: "email-address",
          //   edit: loginEmail ? false : true,
          //   icon: "mail",
          // },
          // {
          //   label: "Mobile Number",
          //   key: "mobile_no",
          //   keyboard: "phone-pad",
          //   edit: loginMobile ? false : true,
          //   icon: "call",
          // },
          { label: "Subject", key: "subject", icon: "document-text" },
        ].map(({ label, key, keyboard, edit, icon }) => (
          <View key={key} style={styles.inputContainer}>
            <Ionicons
              name={icon}
              size={moderateScale(20)}
              color="#003463"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder={label}
              value={form[key]}
              onChangeText={(value) => handleChange(key, value)}
              keyboardType={keyboard || "default"}
              placeholderTextColor="#888"
              editable={edit}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Ionicons
            name="chatbubbles"
            size={moderateScale(20)}
            color="#003463"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Query"
            value={form.query}
            onChangeText={(value) => handleChange("query", value)}
            multiline
            numberOfLines={5}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Submit</Text>
              <Ionicons
                name="send"
                size={moderateScale(20)}
                color="#fff"
                style={styles.buttonIcon}
              />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Or reach us via</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocial("facebook")}
            >
              <FontAwesome
                name="facebook-square"
                size={moderateScale(30)}
                color="#4267B2"
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => openSocial("whatsapp")}
            >
              <FontAwesome
                name="whatsapp"
                size={moderateScale(30)}
                color="#25D366"
              />
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    boxShadow: "0px 0px 1px gray",
    margin: moderateScale(10),
    marginVertical: verticalScale(0),
    paddingBottom: verticalScale(30),
  },
  header: {
    alignItems: "center",
    padding: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(25),
    fontFamily: "Ubuntu-Bold",
    color: "#003463",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(40),
  },
  avatar: {
    height: 150,
    width: 150,
    opacity: 0.9,
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
  textArea: {
    height: verticalScale(120),
    textAlignVertical: "top",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003463",
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(20),
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
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "Ubuntu-Medium",
  },
  buttonIcon: {
    marginLeft: moderateScale(10),
  },
  socialContainer: {
    marginTop: verticalScale(30),
    alignItems: "center",
  },
  socialText: {
    fontSize: moderateScale(16),
    color: "#555",
    marginBottom: verticalScale(15),
    fontFamily: "Ubuntu-Regular",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  socialButton: {
    alignItems: "center",
    marginHorizontal: scale(15),
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: "#fff",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(14),
    color: "#333",
    fontFamily: "Ubuntu-Regular",
  },
});

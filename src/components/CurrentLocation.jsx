import React, { useEffect } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_API_KEY = "AIzaSyCejdiS11ruW2Cyn25mQ0b7HBELYCfaigY";

export default function CurrentLocation() {
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const address = await getGoogleAddress(latitude, longitude);
        console.log("User Address:", address);
      } catch (error) {
        console.log("Error getting location or address:", error.message);
      }
    })();
  }, []);

  const getGoogleAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        await AsyncStorage.setItem("user_location", JSON.stringify(address));
        return address;
      }

      return "Address not found";
    } catch (error) {
      console.log("Google Geocoding error:", error.message);
      return "Failed to get address";
    }
  };

  return null; // This component doesn't render anything
}

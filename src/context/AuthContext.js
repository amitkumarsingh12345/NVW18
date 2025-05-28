// /context/AuthContext.js
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allServicesDetail, setAllServicesDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = "https://nvwebsoft.com/php_api/api.php";

  // 📥 Find Slider
  const findSlider = async () => {
    try {
      const res = await axios.get(`${baseURL}/slider`);
      return res;
    } catch (error) {
      Alert.alert("Fetch Users Failed", error.message);
      return [];
    }
  };

  // 📥 Find Service
  const findService = async () => {
    try {
      const res = await axios.get(`${baseURL}/service`);
      return res;
    } catch (error) {
      Alert.alert("Fetch Users Failed", error.message);
      return [];
    }
  };

  // 📥 Find Service Details
  const findServiceDetails = async () => {
    const formData = new FormData();
    formData.append("query", "");
    try {
      const res = await axios.post(`${baseURL}/service_search`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      Alert.alert("Fetch Users Failed", error.message);
      return [];
    }
  };

  // 📥 Find Portfolio
  const findPortfolio = async () => {
    try {
      const res = await axios.get(`${baseURL}/notification`);
      return res;
    } catch (error) {
      Alert.alert("Fetch Users Failed", error.message);
      return [];
    }
  };

  // 📥 Find Notification
  const findNotification = async () => {
    try {
      const res = await axios.get(`${baseURL}/notification`);
      return res;
    } catch (error) {
      Alert.alert("Fetch Users Failed", error.message);
      return [];
    }
  };

  // 📥 Find Services Details
  const findServiceDetail = async (s) => {
    const url = `${baseURL}/service_search`;
    try {
      const response = await axios.post(url, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAllServicesDetail(response?.data);
      setSearchQuery(response?.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  //find More Service
  const findMoreServices = () => {
    setSearchQuery(allServicesDetail);
  };

  return (
    <AuthContext.Provider
      value={{
        findService,
        findSlider,
        findNotification,
        findServiceDetails,
        findPortfolio,
        findServiceDetail,
        allServicesDetail,
        searchQuery,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { allConstant } from "../constants/Constant";
import { AuthContext } from "../context/AuthContext";

const { height } = Dimensions.get("window");

const CustomTinderCarousel = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { findSlider } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await findSlider();

        if (result.data && Array.isArray(result.data)) {
          const formatted = result.data.map((item, index) => ({
            id: index,
            title: `Slide ${index + 1}`,
            subtitle: "Smart Technology",
            image: {
              uri: `https://nvwebsoft.com/php_api/assets/website_upload/slider/${item.slider_img}`,
            },
          }));
          setCards(formatted);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!cards.length) return;

    const interval = setInterval(() => {
      swiperRef.current?.swipeRight();
    }, 5000);

    return () => clearInterval(interval);
  }, [cards]);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const onSwiped = (index) => {
    setCurrentIndex(index + 1);
  };

  const renderCard = (card) => {
    if (!card) return null;

    return (
      <View style={styles.card}>
        {imageErrors[card.id] ? (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Image not available</Text>
          </View>
        ) : (
          <Image
            source={card.image}
            style={styles.image}
            resizeMode="stretch"
            onError={() => handleImageError(card.id)}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!cards.length) {
    return (
      <View style={styles.errorContainer}>
        <Text>No data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={renderCard}
        onSwiped={onSwiped}
        cardIndex={currentIndex % cards.length}
        stackSize={3}
        infinite
        backgroundColor="transparent"
        cardVerticalMargin={verticalScale(10)}
        cardHorizontalMargin={scale(0)}
        cardStyle={styles.cardWrapper}
        animateCardOpacity // Adds smooth opacity transition
        animateOverlayLabelsOpacity // Smooth overlay transition
        disableTopSwipe // Prevents accidental swipes
        disableBottomSwipe // Prevents accidental swipes
        overlayOpacityHorizontalThreshold={scale(10)} // Makes swipes more precise
        overlayLabels={{
          left: {
            title: "NOPE",
            style: {
              label: {
                backgroundColor: "red",
                color: "white",
                fontSize: moderateScale(22),
                padding: moderateScale(10),
              },
              wrapper: {
                alignItems: "flex-end",
                marginTop: verticalScale(20),
                opacity: 0.7, // Reduced opacity for smoother appearance
              },
            },
          },
          right: {
            title: "LIKE",
            style: {
              label: {
                backgroundColor: "green",
                color: "white",
                fontSize: moderateScale(22),
                padding: moderateScale(10),
              },
              wrapper: {
                alignItems: "flex-start",
                marginTop: verticalScale(20),
                opacity: 0.7, // Reduced opacity for smoother appearance
              },
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: allConstant.os == "ios" ? height * 0.3 : height * 0.32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(15),
    marginTop: verticalScale(-10),

    overflow: "hidden", // Prevents any content from bleeding outside
  },
  cardWrapper: {
    width: "100%",
    height: allConstant.os == "ios" ? height * 0.25 : height * 0.28,
    borderRadius: 15,
  },
  card: {
    flex: 1,
    borderRadius: moderateScale(15),
    overflow: "hidden",
    backgroundColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(15),
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.33,
    backgroundColor: "#f5f5f5", // Added background for smoother loading
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.33,
    backgroundColor: "#f5f5f5", // Added background for smoother appearance
  },
  fallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Lighter fallback background
  },
  fallbackText: {
    color: "#666",
  },
});

export default CustomTinderCarousel;

import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function GetUserId() {
  const user_id = await AsyncStorage.getItem("user_id");
  return user_id;
}

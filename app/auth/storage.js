import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";
import useError from "../hooks/useError";

const key = "onedon";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    useError().send('Storage.js','Error storing the auth token->'+error.message)
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    useError().send('Storage.js','Error getting the auth token->'+error.message)
  }
};

const getUser = async () => {
  const token = await getToken();
  return token ? jwtDecode(token) : null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    useError().send('Storage.js',"Error removing the auth token"+error)
  }
};

export default { getToken, getUser, removeToken, storeToken };

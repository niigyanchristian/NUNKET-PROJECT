import React, { useState,useEffect,useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "./app/components/OfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import useError from "./app/hooks/useError";

SplashScreen.preventAutoHideAsync();





export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);
  
  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user.client);
  };



  async function prepare() {
    try {
      await SplashScreen.preventAutoHideAsync();
        await restoreUser();
      } catch (e) {
        useError().send('App.js',e.message);
      } finally {
      setIsReady(true);
    }
  }
    useEffect(() => {
     try {
      prepare()
     } catch (error) {
      useError().send('App.js',`error in loading->${error.message}`);
     } 
     
    }, []);
  
    const onLayoutRootView = useCallback(async () => {
      if (isReady) {
        await SplashScreen.hideAsync();
      }
    }, [isReady]);
  
    if (!isReady) {
      return null;
    }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}  onReady={onLayoutRootView}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
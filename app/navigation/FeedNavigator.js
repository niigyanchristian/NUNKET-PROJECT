import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import HomeScreen from "../screens/homeScreen";
import routes from "./routes";
const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator  screenOptions={{ headerShown: false }}>
    <Stack.Screen name={routes.MAIN_HOME_SCREEN} component={HomeScreen} options={{headerShown:false}}/>
    <Stack.Screen name={routes.LISTING_DETAILS} component={ListingDetailsScreen} options={{headerShown:false}}/>
    <Stack.Screen name={routes.MY_LISTINGS} options={{headerShown:true,title:'Coffings'}} component={ListingsScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import ListingsScreen from "../screens/ListingsScreen";
import routes from "./routes";
import Transactions from "../screens/TransactionsScreen";
import ReceiptScreen from "../screens/receiptScreen";
import Orders from "../screens/Orders";
const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={routes.MAIN_ACCOUNT_SCREEN} options={{headerShown:false}} component={AccountScreen} />
    <Stack.Screen name={routes.MY_LISTINGS}options={{headerShown:true,title:'My Listings'}} component={ListingsScreen} />
    <Stack.Screen name={routes.TRANSACTIONS} component={Transactions} />
    <Stack.Screen name={routes.RECEIPT_SCREEN} component={ReceiptScreen} />
    <Stack.Screen name={routes.ORDERS} component={Orders} />
  </Stack.Navigator>
);

export default AccountNavigator;

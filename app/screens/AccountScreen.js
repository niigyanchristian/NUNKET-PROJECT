import React,{useEffect, useState} from "react";
import { StyleSheet, View, FlatList,Dimensions } from "react-native";



import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import ScrollingText from "../components/ScrollingText";
import AppText from "../components/Text";
import { getBalance } from "../api/payment";

const menuItems = [
  {
    id:1,
    title: "Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.MY_LISTINGS,
  },
  {
    id:2,
    title: "Transactions",
    icon: {
      name: "cash",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.TRANSACTIONS,
  },
  {
    id:3,
    title: "Orders",
    icon: {
      name: "order-bool-ascending-variant",
      backgroundColor: colors.danger,
    },
    targetScreen: routes.ORDERS,
  }

];

let texts=[
  "God First Teshie Nungua Casket Works  Sunyani",
  "God First Teshie Nungua Casket Works  Sunyani",
  "God First Teshie Nungua Casket Works  Sunyani",
]
function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [balance, setBallance]=useState();
  const [isFetching, setIsFetching]=useState(false);
  const screenWidth = Dimensions.get('window').width;
  useEffect(() => {
    getList();
},[]);
const getList =async ()=>{
  const result =await getBalance(user._id)
  if(!result){
    alert(result.data)
  }
  setBallance(result.data?result.data.accountBalance:0);
}




  return (
    <Screen style={styles.screen}>
      <View >
        <ListItem
          title={user.name}
          subTitle={user.email}
          image={user.admin ? require("../assets/logo1.png"): require("../assets/logo1.png")}
        />
        {user.admin&&<View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        <AppText style={{color:colors.secondary, fontSize:screenWidth*0.07}}>GH₵{balance}.00</AppText>

        </View>}
      </View>
      <View style={styles.container}>
      <FlatList
  onRefresh={() => getList()}
  refreshing={isFetching}
  data={menuItems}
  keyExtractor={(menuItem) => menuItem.id}
  ItemSeparatorComponent={ListItemSeparator}
  renderItem={({ item, index }) => {
    if (index === 0 && !user.admin) {
      // If user is not an admin, skip rendering the first item
      return null;
    } else if (index === 1 && user.admin) {
      // If user is not an admin, skip rendering the first item
      return null;
    }else if (index === 2 && !user.admin) {
      // If user is not an admin, skip rendering the first item
      return null;
    }
    return (
      <ListItem
        title={item.title}
        IconComponent={
          <Icon
            name={item.icon.name}
            backgroundColor={item.icon.backgroundColor}
          />
        }
        onPress={() => navigation.navigate(item.targetScreen)}
      />
    );
  }}
/>

      </View>
      <View style={{}}>
      <ScrollingText texts={texts} duration={4*5000} width={screenWidth} />

      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  
});

export default AccountScreen;

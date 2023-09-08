import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet,Alert } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import useFirebase from "../hooks/useFirebase";

function ListingsScreen({ navigation }) {
  const getListingsApi = useApi(listingsApi.getListings);
  const deleteListingsApi = useApi(listingsApi.deleteListing);
const [refreshing,setRefreshing]=useState(false);
const {user}=useAuth();
  useEffect(() => {
    getList();
  }, []);
  const getList =()=>{
    setRefreshing(true)
    getListingsApi.request();
    setRefreshing(false)
  }

  const deleteHandler = (item)=>{
    setRefreshing(true)
    useFirebase().deleteImage(item.images)
    .then(async data=>{
      if(data){
        await listingsApi.deleteListing(item._id);
        getList();
      }
    });
    // setRefreshing(false)
  }
  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.screen}>
        {getListingsApi.error && (
          <>
            <AppText>Couldn't retrieve the listings.</AppText>
            <Button title="Retry" onPress={getListingsApi.request} />
          </>
        )}
        <FlatList
        onRefresh={()=>{
          getList()
        }}
        refreshing={refreshing}
          data={getListingsApi.data.reverse()}
          keyExtractor={(listing) => listing._id.toString()}
          renderItem={({ item }) => {
          return  (
            <Card
              title={item.title}
              subTitle={"GH₵" + item.price}
              images={item.images}
              onLongPress={()=>{
                if(user.admin){
                Alert.alert("Delete", "Are you sure you want to delete this list?", [
                  { text: "Yes", onPress: () => deleteHandler(item) },
                  { text: "No" },
                ]);
              }
              }}
              onPress={() => {
                if(!user.admin){

                  navigation.navigate('Feed',{
                    screen:routes.LISTING_DETAILS,
                    params:{item}
                  })
                }
              }
              }
              thumbnailUrl={item.images[0]}
            />
          )}}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;

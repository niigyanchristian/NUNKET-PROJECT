import React, { useState,useEffect } from 'react';
import { View, StyleSheet, ImageBackground,Dimensions, Image, FlatList } from 'react-native';
import AppText from '../components/Text';
import { AntDesign } from '@expo/vector-icons';
import AppScrowCard from '../components/AppScrowCard';
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";

let texts=[
    "A dignified farewell begins with a quality coffin. Browse our selection today.",
  "Compassionate care in your time of need. Shop our collection of coffins.",
  "Honoring the memory of your loved one starts with a beautiful coffin. See our offerings here.",
  "Find the perfect coffin for your loved one and say goodbye with utmost care.",
  "Quality coffins for a respectful farewell. Explore our options and make your selection."
  ]

  const menuItems = [
    {
      id:1,
      label: "Customized",
      categoryId:'Customize'
    },
    {
      id:2,
      label: "Foreign",
      categoryId:'Foreign'
    },
    {
      id:3,
      label: "Local",
      categoryId:'Local'
    },
  ];

function HomeScreen({navigation}) {
    const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [index, setIndex] = useState(0);

  const getListingsApi = useApi(listingsApi.getListings);
  const [refreshing,setRefreshing]=useState(false);
    useEffect(() => {
          getList();
          const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % texts.length);

          }, 20*1000); 
          return () => clearInterval(interval);
    }, []);
    const getList =()=>{
        setRefreshing(true)
      getListingsApi.request();
      setRefreshing(false)
    }

    

      
return (
<View style={styles.container}>
    <ImageBackground
    source={require('../assets/images/blueRectangle.png')}
    style={{width:'100%',height:screenHeight*0.4,justifyContent:'center',position:'relative'}}>
        <View style={{padding:screenWidth*0.07,paddingTop:screenWidth*0.03}}>
            <View>
            <Image source={require('../assets/logo.png')} style={{width:screenWidth*0.17,height:screenWidth*0.17,alignSelf:'flex-end',borderRadius:10}}/>
        <AppText style={{color:colors.white,fontSize:screenWidth*0.075}} fontFamily={'NunitoExtraBold'}>Casket Haven</AppText>
        <AppText style={{color:colors.white,fontSize:screenWidth*0.065}} fontFamily={'NunitoExtraBold'}><AppText style={{color:'#FFA800',fontSize:screenWidth*0.065}} children={'Eternal'} fontFamily={'NunitoExtraBold'}/> Resting Place</AppText>
        </View>

        <View style={{marginTop:'3%'}}>
           
        <AppText style={{color:colors.white,fontSize:screenWidth*0.04}}>{texts[index]}</AppText>
        </View>
        <View style={{width:'32%',alignSelf:'center',flexDirection:'row',gap:6,marginTop:'10%'}}>
            <View style={{height:3,flex:1,backgroundColor:'yellow',borderRadius:10}}></View>
            <View style={{height:3,flex:1,backgroundColor:'#dddddda1',borderRadius:10}}></View>
            <View style={{height:3,flex:1,backgroundColor:'#dddddda1',borderRadius:10}}></View>
        </View>
            <View style={{padding:15,backgroundColor:'#ddd',flexDirection:'row',alignItems:'center',borderRadius:10,position:'absolute',top:screenHeight*0.33,alignSelf:'center',width:'90%',zIndex:2}}>
                <Image source={require('../assets/images/search/mingcute_search-line.png')}/>
                <View style={{flex:1,marginLeft:10}}>
                <AppText>Discover ideas...</AppText>
                </View>
                <Image source={require('../assets/images/search/Vector.png')}/>
            </View>
        </View>
    </ImageBackground>

    <View style={{height:5,width:'100%',zIndex:1,marginTop:'10%'}}>
    </View>
    <View style={{height:screenHeight*0.466}}>
        <FlatList
        onRefresh={() => getList()}
        refreshing={refreshing}
        style={{width:screenWidth}}
        data={menuItems}
        keyExtractor={(menuItem) => menuItem.id}
        renderItem={({ item, index }) => {
            return(
                <>
        <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:'2%'}}>
            <AppText fontFamily={'NunitoExtraBold'} style={{flex:1,fontWeight:'700'}}>{item.label}</AppText>
            <AntDesign onPress={()=> navigation.navigate(routes.MY_LISTINGS)} name="arrowright" size={24} color={colors.primary} />
        </View>
        <View style={{width:'90%',alignSelf:'center',marginBottom:'5%',}}>
            <AppText style={{fontSize:screenWidth*0.04,color:colors.medium}}>Most popular</AppText>
        </View>
        <AppScrowCard data={getListingsApi.data? getListingsApi.data.filter((list) => list.categoryId ==item.categoryId): []}/>

                </>
            )
        }}/>   
    </View>
</View>
);
}

export default HomeScreen;
const styles = StyleSheet.create({
container:{
justifyContent:'center',
 alignItems:'center'
},
category:{
    gap:20,
    height:60,
    marginTop:'7%',
    marginBottom:'3%',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center',
},
active:{
    backgroundColor:'#ddd',
    shadowColor: colors.primary,
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2
}
});
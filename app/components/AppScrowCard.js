import React,{useState,useRef} from 'react';
import { View, StyleSheet,ScrollView,Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { Image } from "react-native-expo-image-cache";
import  { Paystack,paystackProps }  from 'react-native-paystack-webview';

import AppText from './Text';
import routes from '../navigation/routes';
import PayStack from './Paystack';
import{useNavigation} from '@react-navigation/native'
import colors from '../config/colors';
import { makePayment } from '../api/payment';
import useAuth from '../auth/useAuth';



function AppScrowCard({data}) {
  const navigation =useNavigation();
    const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [price,setPrice]=useState(0);
  const [ownerId,setOwnerId]=useState();
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
  const {user}=useAuth();
  if(!data||data.length==0){
    return(
      <ScrollView 
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal:5,height:235}}>
      
      <View 
      style={{backgroundColor:colors.light,width:267,marginHorizontal:10,borderRadius:20,overflow:'hidden'}}>
          <View style={{height:'50%',width:'100%',backgroundColor:'#ddd'}}></View>
          <View style={{borderBottomWidth:1,borderColor:colors.primary,borderStyle: 'dashed',padding:10,position:'relative'}}>
            <View style={{height:20,width:'40%',backgroundColor:'#ddd'}}></View>
            <View style={{height:20,width:'70%',backgroundColor:'#ddd',marginTop:5}}></View>
            
          </View>
          <View style={{flexDirection:'row',paddingHorizontal:10}}>
            <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
            <View style={{height:20,width:'40%',backgroundColor:'#ddd'}}></View>
            </View>
            <View style={{flex:1,alignItems:'center',margin:5,height:30,backgroundColor:'#a2befa',borderRadius:20,justifyContent:'center'}}>
            </View>
          </View>
        </View>
        <View 
      style={{backgroundColor:colors.light,width:267,marginHorizontal:10,borderRadius:20,overflow:'hidden'}}>
          <View style={{height:'50%',width:'100%',backgroundColor:'#ddd'}}></View>
          <View style={{borderBottomWidth:1,borderColor:colors.primary,borderStyle: 'dashed',padding:10,position:'relative'}}>
            <View style={{height:20,width:'40%',backgroundColor:'#ddd'}}></View>
            <View style={{height:20,width:'70%',backgroundColor:'#ddd',marginTop:5}}></View>
            
          </View>
          <View style={{flexDirection:'row',paddingHorizontal:10}}>
            <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
            <View style={{height:20,width:'40%',backgroundColor:'#ddd'}}></View>
            </View>
            <View style={{flex:1,alignItems:'center',margin:5,height:30,backgroundColor:'#a2befa',borderRadius:20,justifyContent:'center'}}>
            </View>
          </View>
        </View>
                   
    </ScrollView>

    )
  }



  const handleSubmit = async (data) => {
   
    const result = await makePayment(data,user._id);
    
    if (!result.ok) {
      return alert(result.problem);
    }
    alert('Thanks for buying')

  };
return (
<ScrollView 
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal:5,height:235}}>
      {data.map((item, index) => {
                    return (
      <Pressable 
      onPress={()=>navigation.navigate('Feed',{
        screen:routes.LISTING_DETAILS,
        params:{item}
        })}
      style={{backgroundColor:colors.light,width:267,marginHorizontal:10,borderRadius:20,overflow:'hidden'}}
      key={item._id}>
          <Image preview={{ uri: item.images[0] }}
        tint="dark"
        uri={item.images[0]} style={{height:'50%',width:'100%'}}/>
          <View style={{borderBottomWidth:1,borderColor:colors.primary,borderStyle: 'dashed',padding:10,position:'relative'}}>
            <AppText fontFamily={'NunitoExtraBold'}>{item.title}</AppText>
            <AppText style={{fontSize:screenWidth*0.04}} numberOfLines={1} ellipsizeMode='tail'>{item.description}</AppText>
          </View>
          <View style={{flexDirection:'row',paddingHorizontal:10}}>
            <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
                <AppText style={{fontSize:screenWidth*0.05,color:colors.secondary}} fontFamily={'NunitoExtraBold'}>GH₵{item.price}</AppText>
            </View>
            <TouchableOpacity 
             onPress={()=> {
              setOwnerId(item.ownerId)
              setPrice(item.price)
              if(price && ownerId){
                paystackWebViewRef.current.startTransaction()
              }
            }}
            style={{flex:1,alignItems:'center',margin:5,padding:5,backgroundColor:'#a2befa',borderRadius:20,justifyContent:'center'}}>
                <AppText 
                style={{fontSize:screenWidth*0.05, fontWeight:'700',color:colors.primary}} fontFamily={'NunitoExtraBold'}>Buy</AppText>
            </TouchableOpacity>
          </View>
      <PayStack price={price} handleSubmit={handleSubmit} paystackWebViewRef={paystackWebViewRef} ownerId={ownerId}/>
        </Pressable>
                    )})}



    </ScrollView>
);
}

export default AppScrowCard;
const styles = StyleSheet.create({
container:{
flex:1,
justifyContent:'center',
 alignItems:'center'
}
});



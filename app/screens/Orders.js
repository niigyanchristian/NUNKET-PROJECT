import React,{useState,useEffect} from 'react';
import { StyleSheet, Alert, View,Image,ScrollView,Dimensions, TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import io from 'socket.io-client';
import{useNavigation} from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BallIndicator } from 'react-native-indicators';
import useAuth from '../auth/useAuth';
import AppText from '../components/Text';
import colors from '../config/colors';
import socketApi from '../config/socketApi';

export default function Orders() {
const [transactions,setTransactions]=useState([]);
const navigation =useNavigation();
const {user} = useAuth();
const width = Dimensions.get('window').width;
const [loading,setLoading]=useState(false);
const [show,setShow]=useState(false);
const [showId,setShowId]=useState();
useEffect( () => {
  setLoading(true)
  loadPage();
}, []);
const loadPage = async () =>{  
    const socket = io(socketApi.socketApi);
    socket.emit("orders", {method:"GET",body:{payerId:user._id}});
      socket.on("orders", find=>{
        setTransactions(find);
        setLoading(false);
      });
}
const Served = async (item) =>{  
    const socket = io(socketApi.socketApi);
    socket.emit("orders", {method:"POST",body:{item}});
      socket.on("orders", find=>{
        setTransactions(find);
        setLoading(false);
      });
}

if(loading){
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.white}}>
      <BallIndicator size={25} color={'#09A0D4'} />
    {/* <Text>Loading ...</Text> */}
  </View>
  )
}


if(transactions.length>0){
  return(
<ScrollView style={{backgroundColor:colors.white}}>
            {transactions.map(item=>{
                return(
              <View key={item._id}>
                {/* STARTING */}
                <TouchableWithoutFeedback
                onPress={()=>{
                  setShow(!show)
                  setShowId(item._id)
                  }}>
                <View style={{flexDirection:'row',width:width,}}>
                  <>
                  <View style={{width:'20%',alignSelf:'center',alignItems:'center',}}>
                    <Image resizeMode='center' style={{height:width*0.2,width:width*0.2}}  source={require('../assets/images/paystack.jpg')}></Image>
                  </View>
                  <View style={{width:width*0.55,alignSelf:'center',alignItems:'center',padding:10}}>
                    <AppText style={{fontSize:width*0.04}}>Paystack Collection</AppText>
                    <AppText style={{fontSize:width*0.04}}>Reference ID:<AppText style={{backgroundColor:colors.primary,color:colors.white}}>{item.refId}</AppText></AppText>
                    <AppText style={{fontSize:width*0.04}}>Amount: GHS {item.amount}</AppText>
                    <AppText style={{fontSize:width*0.04}}>Date: {item.date.substring(0,10)}</AppText>
                    </View>
                    <View style={{alignItems:'center',width:width*0.25,justifyContent:'center'}}>
                      
                  <TouchableOpacity 
                  onPress={()=>{
                    Alert.alert('Alert!', 'Continue to delete list from Order List', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      { text: 'Continue', onPress:()=>Served(item)},
                  ])
                    }}
                  style={{backgroundColor:'#09A0D4',alignSelf:'center',alignItems:'center',padding:9,borderRadius:10}}>
                    <AppText style={{color:colors.white,fontSize:width*0.04}}>Done</AppText>
                    </TouchableOpacity>
                    </View>
                    </>
                </View>
                </TouchableWithoutFeedback>
                  <View style={{borderBottomWidth:1,marginLeft:'20%',borderBottomColor:'#ddd'}}></View>
                  {show&& item._id == showId &&<Image source={{uri:item.coffinImage}} style={{width:'100%',height:200}}/>}
                  {/* ENDING */}
                </View>
                )
            })}
          </ScrollView>
  )
}else{
  return(
  <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.white}}>
    <MaterialCommunityIcons name="selection-search" size={50} color="black" />
    <AppText>You have made no transaction</AppText>
  </View>
  )
}
}

const styles = StyleSheet.create({})
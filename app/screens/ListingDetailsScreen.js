import React, { useState,useEffect,useRef } from "react";
import { View,StyleSheet,ScrollView,Linking,TouchableOpacity,Dimensions} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import  { Paystack,paystackProps }  from 'react-native-paystack-webview';

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import call from 'react-native-phone-call';
import AppText from "../components/Text";
import PayStack from "../components/Paystack";
import useAuth from "../auth/useAuth";
import { makePayment } from "../api/payment";
import useError from "../hooks/useError";

function ListingDetailsScreen({ route }) {
  const {item} = route.params;
  const screenWidth = Dimensions.get('window').width;
  const { user} =useAuth();
  const [inputValue, setInputValue] = useState('0243182140');
  const [mobileNumber, setMobileNumber] = useState('+233243182140');
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
  const [price,setPrice]=useState(0);
  const [ownerId,setOwnerId]=useState();

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const { width } = Dimensions.get('window');
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const scrollToNextImage = () => {
    if (scrollViewRef.current) {
      const { width } = Dimensions.get('window');
      const nextIndex = currentIndex === item.images.length - 1 ? 0 : currentIndex + 1;
      const nextX = nextIndex * width;

      scrollViewRef.current.scrollTo({ x: nextX, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToNextImage();
    }, 0.5 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex]);

  async function shareImage() {
    try {
      const fileUri = FileSystem.cacheDirectory + 'image.jpg';
      await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory + 'images/', {intermediates: true}); // create directory if it doesn't exist
      await FileSystem.downloadAsync(item.images[0], fileUri); // download 
      whatsAppShare(fileUri,mobileNumber);
    } catch (error) {
      useError().send('ListingDetailsScreen.js',error.message);
    }
  }

  const whatsAppShare = async (uri, phoneNumber) => {
    const shareOptions = {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share via WhatsApp',
      UTI: 'public.jpeg',
      recipients: [`${phoneNumber}@s.whatsapp.net`],
    };
    await Sharing.shareAsync(uri, shareOptions).then((result) => {
      if (result.action === Sharing.sharedAction) {
        if (result.activityType) {
          useError().send('ListingDetailsScreen.js',`Shared via ${result.activityType}`);
        } else {
          useError().send('ListingDetailsScreen.js','Shared');
        }
      } else if (result.action === Sharing.dismissedAction) {
        useError().send('ListingDetailsScreen.js','Share cancelled');
      }
    })
    .catch((error) =>useError().send('ListingDetailsScreen.js',`Sharing failed -> ${error.message}`));
  };

  // whatsapp
  const initiateWhatsAppSMS = (image) => {
    // Check for perfect 10 digit length
    if (mobileNumber.length != 10 && mobileNumber.length != 13) {
      alert('Please insert correct contact number');
      return;
    }
    const url = `whatsapp://send?phone=${mobileNumber}&text=&source=&data=&abid=&app_absent=&sendMedia=true&media=${encodeURIComponent(item.images[0])}`;
    Linking.openURL(url)
      .then((data) => {
        useError().send('ListingDetailsScreen.js','WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };

  // call
  const triggerCall = () => {
    // Check for perfect 10 digit length
    if (inputValue.length != 10) {
      alert('Please insert correct contact number');
      return;
    }

    const args = {
      number: inputValue,
      prompt: true,
    };
    // Make a call
    call(args).catch(console.error);
  };

  const handleSubmit = async (data) => {
   
    const result = await makePayment(data,user._id);
    
    if (!result.ok) {
      return alert(result.problem);
    } 
    alert('Thanks for buying')

  };
  return (
    <ScrollView>
      <ScrollView
       ref={scrollViewRef}
       horizontal
       showsHorizontalScrollIndicator={true}
       onScroll={handleScroll}
       scrollEventThrottle={16}
    >
      {item.images.map((url, index) => {
        return (
          <Image
            key={index}
            style={[styles.image, { width: screenWidth }]}
            preview={{ uri: url }}
            tint="dark"
            uri={url}
          />
        );
      })}
    </ScrollView>
      <View style={[styles.detailsContainer]}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={styles.price}>GH₵{item.price}</Text>
        <TouchableOpacity
        onPress={()=> {

          setOwnerId(item.ownerId)
          setPrice(item.price)
          if(price && ownerId){
            paystackWebViewRef.current.startTransaction()
          }
        }}
        
        style={{backgroundColor:'#a2befa',padding:10,borderRadius:10,}}>
        <AppText style={{color:colors.primary,fontWeight:'700'}}>Buy</AppText>

        </TouchableOpacity>
        </View>
        <Text style={{}}>{item.description}</Text>
        <View style={[styles.userContainer,{backgroundColor:colors.light}]}>
          <ListItem
            image={require("../assets/logo1.png")}
            title="Francis Adjetey"
          />
          <View style={{flexDirection:'row',width:'80%',alignSelf:'center',justifyContent:'space-between'}}>
          <TouchableOpacity
            onPress={triggerCall}
            style={{alignItems:'center'}}>
            <MaterialIcons name="call" size={25} color={colors.primary} />
            <Text style={{color:'#333',fontSize:15}}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={initiateWhatsAppSMS}
            style={{alignItems:'center'}}>
            <FontAwesome name="whatsapp" size={25} color="green" />
            <Text style={{color:'#333',fontSize:15}}>WhatsApp</Text>
       </TouchableOpacity>
          <TouchableOpacity 
            onPress={shareImage}
            style={{alignItems:'center'}}>
            <Feather name="share-2" size={24} color={colors.primary} />
            {/* <FontAwesome name="share" size={25} color="blue" /> */}
            <Text style={{color:'#333',fontSize:15}}>Share</Text>
       </TouchableOpacity>
         </View>
        </View>
      </View>
      <PayStack handleSubmit={handleSubmit} ownerId={ownerId} paystackWebViewRef={paystackWebViewRef} price={price} coffinImage={item.images[0]}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    // width: 300,
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    backgroundColor:'red'
  },
});

export default ListingDetailsScreen;

import React from 'react';
import { StyleSheet } from 'react-native';
import  { Paystack,paystackProps }  from 'react-native-paystack-webview';
import useAuth from '../auth/useAuth';

function PayStack({price,ownerId,coffinImage,handleSubmit,paystackWebViewRef}) {
  const {user}=useAuth();
  
return (
<Paystack  
        paystackKey="pk_live_647c31255ab32f254a3307866f75370f6f77e306"
        amount={price}
        currency='GHS'
        billingEmail={'niigyanchristian@gmail.com'}
        activityIndicatorColor="green"
        channels={true}
        onCancel={(e) => {
          alert('You canceled your payment method');
        }}
        onSuccess={(res) => {
            let data={
                  userId:ownerId,
                  amount:price,
                  payerId:user._id,
                  receiverId:ownerId,
                  status:res.status,
                  refId:res.transactionRef.trxref,
                  coffinImage
            }
            handleSubmit(data);
          }}
        ref={paystackWebViewRef}
      /> 
);
}

export default PayStack;
const styles = StyleSheet.create({
container:{
flex:1,
justifyContent:'center',
 alignItems:'center'
}
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Dimensions } from 'react-native';
import { Ionicons,MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  BallIndicator
} from 'react-native-indicators';
import moment from 'moment/moment';
import colors from '../config/colors';
import useAuth from '../auth/useAuth';

const ReceiptScreen = ({ route }) => {
  const { service } = route.params;
  const width = Dimensions.get('window').width;
  
  const [loading,setLoading]=useState(false);
  
  function convertDateStringToDateObject(dateString) {
    const date = moment(dateString);
    const year = date.year();
    const month = date.format('MMMM');
    let day = date.date();
    if(day == '1'|| day=='21' || day =='31'){
        day= day.toString()+'st';
    }else if(date == '2' || day == '22'){
      day= day.toString()+'nd';
    }else if(date == '3' || day == '23'){
      day= day.toString()+'rd';
    }else{
      day= day.toString()+'th';
    }
    return { year, month, day };
  }
  
const {year,month,day} =convertDateStringToDateObject(service.date);


const handleDownload = async () => {
  // Create a HTML template for the payment receipt
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Payment Receipt</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 16px;
        color: #333;
        line-height: 1.5;
        background-color: #f2f2f2;
      }
      h1 {
        font-size: 32px;
        margin: 30px 0;
        text-align: center;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      table {
        margin: 30px auto;
        border-collapse: collapse;
        width: 80%;
        background-color: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
      }
      th, td {
        padding: 20px 30px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .amount {
        font-weight: bold;
        font-size: 24px;
        color: #2ecc71;
      }
      .footer {
        margin-top: 50px;
        text-align: center;
        color: #999;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #555;
        text-decoration: none;
        border-bottom: 1px dashed #ccc;
      }
      @media (max-width: 768px) {
        table {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <h1>Payment Receipt</h1>
    <table>
      <tr>
        <th>Date:</th>
        <td>${day} ${month}, ${year}</td>
      </tr>
      <tr>
        <th>Transaction ID:</th>
        <td>${service.refId}</td>
      </tr>
      <tr>
        <th>Amount Paid:</th>
        <td class="amount">GH₵${service.amount}.00</td>
      </tr>
      <tr>
        <th>Paid To:</th>
        <td class="amount">Mr. Francis Adjetey Quashi</td>
      </tr>
    </table>
    <div class="footer">
      <p>Thank you for your payment!</p>
      <p>&copy; ${new Date().getFullYear()} NUNKET App. All rights reserved.</p>
    </div>
  </body>
  </html>
  
  
  `;
  
  try {
    // Generate a PDF file from the HTML content using Expo Print
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    
    // Share the PDF file using Expo Sharing
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    setLoading(false);
  } catch (error) {
    setLoading(false);
    }
};





  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo1.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Payment Receipt</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Transaction ID:</Text>
        <Text style={styles.value}>{service.refId}</Text>
        <Text style={styles.title}>Payment Date:</Text>
        <Text style={styles.value}>{day} {month}, {year}</Text>
        <Text style={styles.title}>Amount:</Text>
        <Text style={styles.value}>GH₵{service.amount}.00</Text>
        <View style={{flexDirection:'row'}}>

        <Text style={styles.value}>Served</Text>
        {!service.served && <MaterialIcons name="cancel" size={24} color="grey" />}
        {service.served && <Ionicons name="checkmark-circle-sharp" size={24} color="green" />}
        </View>
        <TouchableOpacity style={styles.downloadButton} onPress={()=>{
          setLoading(true)
          handleDownload()
          }}>
          {loading &&<BallIndicator size={width*0.04} color={colors.white} />}
          {!loading&&<Ionicons name="md-share-social" size={24} color={colors.white} />}
          <Text style={styles.downloadButtonText}>Download & Share Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius:10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: colors.white,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiptScreen;


// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image, Alert, TextInput } from 'react-native';
import firebase from '../database/firebase';
import QRCode from 'react-native-qrcode-generator';


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      uid: firebase.auth().currentUser.uid,
      barcode: 'http://paybybarcode.fun',
      paymentAmount: 0,
      barcodeVisible: 0,
    };
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  };

  //update payment amount
  changePayment = (text) => {
    this.setState({
      payment: text
    })
  };

  changeDescription = (text) => {
    this.setState({
      description: text
    })
  };

  //generate barcode
  createBarcode = () => {
    //make sure value in payment blank is a number
    if(isNaN(this.state.payment) || this.state.payment <= 0) {
      Alert.alert("Payment amount must be greater than $0.00");
      return;
    };
    //create barcode
    this.setState({
      barcode: 'http://paybybarcode.fun/home/amount=' + this.state.payment + '/id=' + this.state.uid + '/des=' + this.state.description + '/name=' + this.state.displayName,
      barcodeVisible: 1
    });
  };

  render() {
     
    return (
      <ScrollView>
      
      <Image style= { styles.backgroundImage } source={require('./b2.jpg')} >
      </Image>
      <Image source={require('../components/LOGO.png')} />

      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.displayName}          
        </Text>
        <Text
        style={{
          textAlign: "center",
          color: "#ffffff",
          fontWeight: "bold",
          paddingTop: 0,
        
        }}>
        Welcome To Pay By Barcode</Text>
        <Text
        style={{
          textAlign: "center",
          color: "#ffffff",
          fontWeight: "bold",
          paddingTop: 0,
        
        }}>
        Make all your Payments with just a scan!</Text>

        <View style={styles.item}>
          <Text style={styles.headers}>Description</Text>
          <Text style={styles.headers}>Price</Text>
        </View>

        <View style={styles.item}>
          <TextInput
            style={styles.inputDescription}
            onChangeText={text => this.changeDescription(text)}
            value={this.state.description}
          />
          <TextInput
            style={styles.inputPayment}
            onChangeText={text => this.changePayment(text)}
            value={this.state.payment}
            keyboardType={'numeric'}
          />
        </View>
		  
		  <View style={styles.barButton}>
		    <Button
			  title="Generate Barcode"
			  onPress = {this.createBarcode}
        color="#00a8cc"
        />
		  </View>
		  
		  <View style={styles.qrCode} opacity={this.state.barcodeVisible}>
      <QRCode
			  value={this.state.barcode}
			  size={200}
			  />
		  </View>

        <Button
        color="#00a8cc"
        title="Logout"
          onPress={() => this.signOut()}
        />
      </View>

      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  backgroundImage:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 1,
    width:400,
    height:700

},
  barButton: {
	  fontSize: 60,
	  width: '70%',
    marginTop: 10,
	  /*marginHorizontal: '36%'*/
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    padding: 40,
  },
  headers: {
    color: '#ffffff',
    fontSize: 25,
    marginRight: 30,
    marginLeft: 75,
    textDecorationLine: 'underline',
    paddingBottom:5
  },
  inputDescription: {
    color: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    height: 30,
    fontSize: 20,
    textAlign: 'left',
    marginRight: 20,
    paddingLeft: 2  
  },
  inputPayment: {
    color: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    width: '30%',
    height: 30,
    fontSize: 20,
    textAlign: 'right',
    marginLeft: 5,
    paddingRight: 5,
  },
  item: {
    flexDirection: 'row',
    color: '#ffffff',

    marginTop: 10
  },
  qrCode: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 5
  },
  textStyle: {
    fontSize: 25,
    marginBottom: 10,
    color: '#ffffff',
    textDecorationLine: 'underline',



  }
});
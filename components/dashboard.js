// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image, Alert, TextInput } from 'react-native';
import firebase from '../database/firebase';
import QRCode from 'react-native-qrcode-generator';
import moment from 'moment';
import 'firebase/firestore';

function btoa(data) { return new Buffer(data, "binary").toString("base64"); }
function atob(data) { return new Buffer(data, "base64").toString("binary"); }

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      //displayName: firebase.auth().currentUser.displayName,
      uid: firebase.auth().currentUser.uid,
      barcode: 'http://paybybarcode.fun',
      paymentAmount: 0,
      barcodeVisible: 0
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

    //generate key
    var confirmKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    //invoice in firebase
    firebase.firestore().collection('invoices')
      .add({
        user: this.state.uid,
        payment: this.state.payment,
        description: this.state.description,
        creationDate: moment().format('llll'),
        processed: false,
        securityKey: confirmKey,
    })
      .then((invoice) => {
        this.setState({
          barcode: 'http://paybybarcode.fun/home/invoice=' + invoice.id + '/key=' + confirmKey,
          barcodeVisible: 1
        })
      })
      .catch(function(error) {
        Alert.alert(error.message)
      });
  };

  render() {
     
    return (
      <ScrollView>
      
      <Image style= { styles.backgroundImage } source={require('./b2.jpg')} >
      </Image>
      <Image source={require('../components/LOGO.png')} style={{ width:'100%',  alignSelf: "center",opacity: 0.9, padding:0     }}/>

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

        <View style={styles.item1}>
          <Text style={styles.headers}>Description</Text>
          <Text style={styles.headers}>Price</Text>
        </View>

        <View style={styles.item2}>
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
    width:'100%',
    height:'100%'

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
    padding: 20,
    paddingBottom:100
  },
  headers: {
    color:'#00a8cc',

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
  item1: {  
    flexDirection: 'row',
    color: '#ffffff',
    alignItems: 'center',
    marginTop: 20
  },
  item2: {
    flexDirection: 'row',
    color: '#ffffff',
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',

  },
  qrCode: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 5,
    marginBottom: 10

  },
  textStyle: {
    fontSize: 25,
    marginBottom: 10,
    padding:0,
    color: '#00a8cc',
    textDecorationLine: 'underline',
  }
});
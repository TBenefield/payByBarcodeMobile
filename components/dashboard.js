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
      <Image source={require('../components/LOGO.png')} />

      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.displayName}          
        </Text>
        <Text>Welcome To Pay By Barcode</Text>
        <Text>Make all your Payments with just a scan!</Text>

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
			  color='#3740FE'
			/>
		  </View>
		  
		  <View style={styles.qrCode} opacity={this.state.barcodeVisible}>
      <QRCode
			  value={this.state.barcode}
			  size={200}
			  />
		  </View>

        <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        />
      </View>

      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
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
    marginTop: 20,
    padding: 40,
    backgroundColor: '#fff'
  },
  headers: {
    fontSize: 25,
    marginRight: 30,
    marginLeft: 75,
    textDecorationLine: 'underline',
  },
  inputDescription: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '70%',
    height: 30,
    fontSize: 20,
    textAlign: 'left',
    marginRight: 20,
    paddingLeft: 5,
  },
  inputPayment: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '25%',
    height: 30,
    fontSize: 20,
    textAlign: 'right',
    marginLeft: 20,
    paddingRight: 5,
  },
  item: {
    flexDirection: 'row',
    marginTop: 10
  },
  qrCode: {
	  marginTop: 10,
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  }
});
// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image, Alert, TextInput } from 'react-native';
import firebase from '../database/firebase';
import QRCode from 'react-native-qrcode-generator';
import moment from 'moment';
import 'firebase/firestore';
import { greaterThan } from 'react-native-reanimated';

function btoa(data) { return new Buffer(data, "binary").toString("base64"); }
function atob(data) { return new Buffer(data, "base64").toString("binary"); }

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      uEmail: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid,
      barcode: 'http://paybybarcode.fun',
      paymentAmount: 0,
      barcodeVisible: 0,
      transactionInProgress: 0,
      processed: 0,
      firebase: firebase.firestore().collection('invoices'),
      awaitingConfirmation: 0,
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

  //confirm and allow the user to enter next transaction.  Barcode is made invisible and text boxes are emptied
  confirm = () => {
    this.setState({
      payment: null,
      description: '',
      transactionInProgress: 0,
      processed: 0,
      barcodeVisible: 0,
      awaitingConfirmation: 0,
    })
  }

  //generate barcode
  createBarcode = () => {
    //check if a transaction is already happening
    if(this.state.transactionInProgress) {
      Alert.alert("Payment has not yet been made.");
      return;
    }

    //make sure value in payment blank is a number
    if(isNaN(this.state.payment) || this.state.payment <= 0) {
      Alert.alert("Payment amount must be greater than $0.00");
      return;
    };

    //start transaction, this will disable text and buttons
    this.setState({ transactionInProgress: 1});    

    //generate confirmation key
    var confirmKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    //invoice in firebase
    this.state.firebase
      .add({
        user: this.state.displayName, 
        userEmail: this.state.uEmail,
        payment: this.state.payment,
        description: this.state.description,
        creationDate: moment().format('llll'),
        processed: 0,
        securityKey: confirmKey,
    })
      .then((invoice) => {
        //generate url for barcode and make it visible
        this.setState({
          barcode: 'http://paybybarcode.fun/home/invoice=' + invoice.id + '/key=' + confirmKey,
          barcodeVisible: 1,
          awaitingConfirmation: 1,
        })
        //watch the snapshot of firestore for the confirmation of payment
        this.state.firebase.doc(invoice.id).onSnapshot((shot) => {            
          this.setState({ 
            processed: shot.data().processed,
            awaitingConfirmation: shot.data().processed ? 0 : 1,
          });
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
            editable={!this.state.transactionInProgress}
          />
          <TextInput
            style={styles.inputPayment}
            onChangeText={text => this.changePayment(text)}
            value={this.state.payment}
            keyboardType={'numeric'}
            editable={!this.state.transactionInProgress}
          />
        </View>
		  
		  <View style={styles.barButton}>
		    <Button
			  title="Generate Barcode"
			  onPress = {this.createBarcode}
        color="#00a8cc"
        disabled={this.transactionInProgress}
        />
		  </View>
		  
		  <View style={styles.qrCode} opacity={this.state.barcodeVisible}>
      <QRCode
			  value={this.state.barcode}
			  size={200}
			  />
		  </View>

      <View style={styles.item1} opacity={this.state.awaitingConfirmation}>
      <Text
        style={{
          fontSize: 15,
          color: "#ffffff",
          fontWeight: "bold",
          paddingTop: 0,
        }}>
        Awaiting Confirmation of Payment</Text>
        <Image source={require('../components/loading.gif')} style={{ width:30,height:30,opacity: 0.9, marginLeft:20}}/>
      </View>

      <View style={styles.confirmButton} opacity={this.state.processed}>
		    <Button
        title="Confirm Payment"
        onPress = {this.confirm}
        color='green'
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
  confirmButton: {
    fontSize: 60,
	  width: '70%',
    marginTop: 10,
    backgroundColor: 'green',
    marginBottom: 5,
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
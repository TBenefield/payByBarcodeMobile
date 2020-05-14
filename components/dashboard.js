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
      
      <Image style= { styles.backgroundImage } source={require('./bb1.jpg')} >
      </Image>
      <Image source={require('../components/LOGO.png')} style={{ width:'110%',  alignSelf: "center",opacity: 1, padding:0     }}/>
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
          color: "#000000",
          fontWeight: "bold",
          paddingTop: 0,
        }}>
        Awaiting Confirmation of Payment</Text>
        <Image source={require('../components/loading.gif')} style={{ width:30,height:30,opacity: 1, marginLeft:20}}/>
      </View>

      <View style={styles.confirmButton} opacity={this.state.processed}>
        <Button
        title="Confirm Payment"
        onPress = {this.confirm}
        />
      </View>

      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.displayName}          
        </Text>
   
        <Text
        style={{
          textAlign: "center",
          color: "#000000",
          fontWeight: "bold",
          padding: 0,
          fontSize:17
        
        }}>
        Please enter your Transaction Details</Text>





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
    width:"90%",
	  fontSize: 60,
    marginTop: 5,
    marginBottom:5

	  /*marginHorizontal: '36%'*/
  },
  confirmButton: {
    fontSize: 60,
	  width: '70%',
    marginTop: 0,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    paddingBottom:100
  },
  headers: {
    color:'#000000',
    fontSize: 25,
    marginRight: 30,
    marginLeft: 75,
    textDecorationLine: 'underline',
    paddingBottom:2,
    marginTop:15
  },
  inputDescription: {
    color: '#000000',
    borderColor: '#000000',
    width: '80%',
    height: 30,
    fontSize: 20,
    fontWeight:"bold",
    textAlign: 'left',
    padding: 0,
    marginLeft:45,
    alignSelf: "center",
    borderColor: "#000000",
    borderBottomWidth: 2,
    color:'#000000',
    backgroundColor:"rgba(206, 206, 206, 0.322)",

  },
  inputPayment: {
    color: '#000000',
    borderColor: '#000000',
    width: '26%',
    height: 30,
    fontSize: 20,
    textAlign: 'right',
    marginLeft: 5,
    paddingRight: 5,
    padding: 0,
    marginRight:45,
    alignSelf: "center",
    borderColor: "#000000",
    borderBottomWidth: 2,
    color:'#000000',
    backgroundColor:"rgba(206, 206, 206, 0.322)",


  },
  item1: {  
    flexDirection: 'row',
    color: '#000000',
    alignItems: 'center',
    marginTop: 0,
    flex: 1,
    display: "flex",
    justifyContent: 'center',
  },
  item2: {
    flexDirection: 'row',
    color: '#000000',
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',

  },
  qrCode: {
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'center',
    flex: 1,
    display: "flex",
    justifyContent: 'center',

  },
  textStyle: {
    fontSize:30,
    marginBottom: 0,
    padding:0,
    color: '#000000',
    fontWeight:"bold",
  }
});
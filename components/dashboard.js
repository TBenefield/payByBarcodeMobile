// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image } from 'react-native';
import firebase from '../database/firebase';


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  

  render() {
    this.state = { 
      displayName: firebase.auth().currentUser.displayName,
      uid: firebase.auth().currentUser.uid
    }    
    return (
      <ScrollView>
      <Image source={require('../components/LOGO.png')} />

      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.displayName}          
        </Text>
        <Text>Welcome To Pay By Barcode</Text>
        <Text>Make all your Payments with just a scan!</Text>

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
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 40,
    backgroundColor: '#fff'
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  }
});
// components/signup.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image, ImageBackground, ScrollView, Linking  } from 'react-native';
import firebase from '../database/firebase';


export default class Signup extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName
        })
        console.log('User registered successfully!')
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Login')
      })
      .catch((error) => {
        Alert.alert(error.message);
        this.setState({
          isLoading: false
        })
      })      
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
      
      <ScrollView>
      <ImageBackground style= { styles.backgroundImage }   blurRadius={0} source={require('./bb1.jpg')} />
      
      <Image source={require('../components/LOGO.png')}  style={{ width:'110%',  alignSelf: "center", padding:0, margin:0 }} />
    <Image source={require('../components/giphy.gif')} style={{height:165, width:'100%',  alignSelf: "center",opacity: 1 , margin:0,padding:0    }}/>

      <Text    style={{
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold",
        fontSize:20,
        paddingTop: 0,
        paddingBottom:20,
        opacity: 1,
        textDecorationLine: 'underline'
      }}
      onPress={ ()=> Linking.openURL('https://paybybarcode.fun') } >To Learn More Go To PayByBarcode.fun</Text>
      <View style={styles.container}>  
      <Text    style={{
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold",
        paddingTop: 0,
        fontSize:22,
        paddingBottom:10,
        opacity: 1,
        textDecorationLine: 'none'
      }}
  >Sign Up</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          placeholderTextColor= "#000000"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />      
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          placeholderTextColor= "#000000"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          placeholderTextColor= "#000000"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <View style={[{ width: "90%", padding:0, alignSelf:"center"}]}>

        <Button 
          color="#00a8cc"
          title="Signup"
          onPress={() => this.registerUser()}
        />
        </View>

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>                          
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
    width: "auto",
    height:"auto",
    justifyContent: "center"

},
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 0,
    paddingBottom: 150
  },
  inputStyle: {
    width: '90%',
    marginBottom: 15, 
    padding: 5,
    fontSize: 18,
    fontWeight:"bold",
    alignSelf: "center",
    borderColor: "#000000",
    borderBottomWidth: 1,
    color:'#000000',
    backgroundColor:"rgba(206, 206, 206, 0.322)",

  },
  loginText: {
    color: '#ffffff',
    marginTop: 5,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});
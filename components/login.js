// components/login.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image, ScrollView, ImageBackground,Linking } from 'react-native';
import firebase from '../database/firebase';


export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
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

  userLogin = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        //console.log(res);
        console.log('User logged-in successfully!');
        this.setState({
          isLoading: false, 
          email: '', 
          password: ''
        })
        this.props.navigation.navigate('Dashboard')
      })
      .catch((error) => {
        Alert.alert(error.message);
        this.setState({
          isLoading: false
        })
      })
    }
  }

  //style={{ width:'100%', backgroundColor:"#00a8cc"}}
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}  >
        
        <ActivityIndicator size="large" />
        </View>
        )
      }    
      return (
        <ScrollView >
        <Image style= { styles.backgroundImage } source={require('./b1.jpg')} >
        </Image>
        <View style={styles.container}>  
        <Image source={require('../components/LOGO.png')} style={{ width:'100%',  alignSelf: "center",opacity: 0.9     }}/>
      <Text    style={{
        textAlign: "center",
        color: "#ffffff",
        fontWeight: "bold",
        marginTop: 50,
        paddingBottom:30,
        opacity: 0.8,
        textDecorationLine: 'underline'
      }}
      onPress={ ()=> Linking.openURL('https://paybybarcode.fun') } > Click Here To Learn More About PayByBarcode.fun</Text>
        <Text 
        style={{
          textAlign: "center",
          color: "#ffffff",
          fontWeight: "bold",
          opacity: 0.8,
          marginBottom:50
        }}>
        Make Payments The Easy Way!</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          autoCapitalize='none'
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="#00a8cc"
          title="Signin"
          onPress={() => this.userLogin()}
        />   

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Signup')}>
          Don't have account? Click here to signup
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
    width:'100%',
    height:'100%'

},
  
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
    marginBottom:220
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    color:'#ffffff'
  },
  loginText: {
    color: '#ffffff',
    marginTop: 25,
    textAlign: 'center',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});
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
        <Image style= { styles.backgroundImage } source={require('./bb1.jpg')} >
        </Image>
        <View style={styles.container}>  
        <Image source={require('../components/LOGO.png')} style={styles.logo   }/>
        <Image source={require('../components/giphy.gif')} style={{height:165, width:'100%',  alignSelf: "center",opacity: 1 , margin:0,padding:0    }}/>

        <Text 
        style={{
          textAlign: "center",
          color: "#000000",
          fontWeight: "bold",
          opacity: 1,
          fontSize:28,
          paddingTop:0,
          marginBottom:5
        }}>
        Make Payments The Easy Way!</Text>
        <Text    style={{
        textAlign: "center",
        color: "#000000",
        fontWeight: "bold",
        fontSize:16,
        marginTop: 5,
        paddingBottom:50,
        opacity: 1,
        textDecorationLine: 'underline'
      }}
      onPress={ ()=> Linking.openURL('https://paybybarcode.fun') } > Click Here To Learn More About PayByBarcode.fun</Text>

        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          placeholderTextColor= "#000000"
          value={this.state.email}
          autoCapitalize='none'
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
          title="Signin"
          onPress={() => this.userLogin()}
        />   
        </View>

        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Signup')}>
          Don't have account? Click here to Signup
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
    padding: 0,
    marginBottom:150,
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
    paddingTop: 5,
    marginTop: 5,
    textAlign: 'center',
    fontSize:15,
  },
  logo:{
    height:130, 
    width:'110%',  
    alignSelf: "center",
    opacity: 1 , 
    margin:0,
    padding:0 
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
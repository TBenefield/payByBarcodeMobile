import * as React from 'react';
import {Button, StyleSheet, Text, TextInput, View, Alert} from 'react-native';

export default function Item() {
  const [description, changeDescription] = React.useState('');
  const [payment, changePayment] = React.useState('');

    return(
        <View style={styles.item}>
          <TextInput
            style={styles.inputDescription}
            onChangeText={text => changeDescription(text)}
            value={description}
          />
          <TextInput
            style={styles.inputPayment}
            onChangeText={text => changePayment(text)}
            value={payment}
            keyboardType={'numeric'}
          />
        </View>
    );
}
const styles = StyleSheet.create({
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
      marginLeft: 10,
      paddingRight: 5,
    },
    item: {
      flexDirection: 'row',
      marginTop: 10
    },
  });

  /*
  export default class ItemList extends React.Component {
    constructor() {
    super();
    this.state = {
      itemCount: 1
    }
  }
  render() {
    return(
      <View>
        <Item />
      </View>
      )
        }
}
  <Button
          title='+'
          onPress = {() => {
            this.setState({
              itemCount: this.state.itemCount + 1
            })
          }}
          color='#3740FE'
          fontSize={20}
        />
        */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import {
  FlexColumn,
  FlexRow,
  TextField,
  TextLabel,
  LoginButton,
  ButtonText,
  Spacer,
  TextButton
} from '../styles/LoginStyles'

export default class Login extends Component {
  render() {
    return (
      <FlexColumn style={styles.container}>
        <TextField style={{ alignSelf: 'center' }}>
          <FlexRow style={{ alignItems: 'center' }}>
            <TextLabel>Mobile</TextLabel>
            <TextInput
              style={{ fontSize: 18, color: '#fff', flex: 1 }}
              selectionColor="#fff"
              underlineColorAndroid="transparent"
              //   onChangeText={text => {
              //     this.setState({ phno: text })
              //   }}
              keyboardType="numeric"
              maxLength={10}
              onSubmitEditing={() => this.passwordInput.focus()}
              returnKeyType="next"
              ref={input1 => {
                this.emailInput = input1
              }}
            />
          </FlexRow>
        </TextField>

        <TextField style={{ marginTop: 12, alignSelf: 'center' }}>
          <FlexRow style={{ alignItems: 'center' }}>
            <TextLabel>Password</TextLabel>
            <TextInput
              style={{ fontSize: 18, color: '#fff', flex: 1 }}
              selectionColor="#fff"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => this.setState({ pwd: text })}
              returnKeyType="go"
              ref={input2 => {
                this.passwordInput = input2
              }}
            />
          </FlexRow>
        </TextField>

        <FlexColumn
          style={{ alignItems: 'center', width: '100%', marginTop: 12 }}
        >
          <LoginButton
            full
            onPress={() => {
              this.props.navigation.navigate('Drawer')
              console.log('Logged In')
            }}
            style={{ marginBottom: 8 }}
          >
            <ButtonText>Login</ButtonText>
          </LoginButton>
          <TouchableOpacity style={{ padding: 12 }}>
            <TextButton>Forgot Password</TextButton>
          </TouchableOpacity>
        </FlexColumn>
      </FlexColumn>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

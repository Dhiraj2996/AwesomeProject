import React, { Component } from 'react'
import {
  StyleSheet,
  Alert,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  AsyncStorage
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
import { LoginUrl } from '../assests/Apiurls'

export default class Login extends Component {
  state = {
    mobile: '',
    password: ''
  }
  LoginApi = () => {
    console.log('In LoginApi')
    fetch(LoginUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber: this.state.mobile,
        password: this.state.password
      })
    })
      .then(data => {
        return data.json()
      })
      .then(data => {
        console.log(data)
        if (data.message == 'Login succesfully') {
          console.log('data received:', data.message)
          console.log('device_name::', data.deviceName)
          console.log('userId::', data.userId)
          this._storeData(data)
          this.props.navigation.navigate('Drawer')
          console.log('Logged In')
        } else {
          Alert.alert('Login Unsuccessful')
        }
      })
      .catch(error => {
        Alert.alert('Login Unsuccessful')
      })
  }
  _storeData = async record => {
    try {
      await AsyncStorage.multiSet([
        ['userId', JSON.stringify(record.userId)],
        ['deviceName', record.deviceName]
      ])
    } catch (error) {
      // Error saving data
    }
  }
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
              onChangeText={text => {
                this.setState({ mobile: text })
              }}
              keyboardType="numeric"
              maxLength={10}
              onSubmitEditing={() => this.passwordInput.focus()}
              returnKeyType="next"
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
              onChangeText={text => this.setState({ password: text })}
              returnKeyType="go"
            />
          </FlexRow>
        </TextField>

        <FlexColumn
          style={{ alignItems: 'center', width: '100%', marginTop: 12 }}
        >
          <LoginButton
            full
            onPress={() => {
              this.LoginApi()
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

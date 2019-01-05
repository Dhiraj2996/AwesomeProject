import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid
} from 'react-native'

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location permission is needed',
        message: 'Please enable permission'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location')
    } else {
      console.log('Location permission denied')
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class Home extends Component {
  state = {
    message: 'go to battery page'
  }
  componentDidMount = async () => {
    await requestLocationPermission()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Dhananjay Here</Text>
        <Button
          title="Hello"
          onPress={() => {
            this.props.navigation.navigate('Battery')
            console.log('Button pressed')
          }}
        />
        <Text>{this.state.message}</Text>
      </View>
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

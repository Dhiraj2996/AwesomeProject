import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid
} from 'react-native'

export default class LastCycle extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>Hello user</Text>
        <Text style={styles.welcome}>Last Cycle Data displayed here</Text>
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

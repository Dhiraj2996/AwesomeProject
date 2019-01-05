import React, { Component } from 'react'
import Home from './screens/home'
import Battery from './screens/battery'
import { createStackNavigator, createAppContainer } from 'react-navigation'

const AppStackNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  Battery: { screen: Battery }
})
const AppContainer = createAppContainer(AppStackNavigator)

export default class App extends Component {
  render() {
    return <AppContainer />
  }
}

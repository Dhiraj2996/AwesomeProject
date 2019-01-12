import React, { Component } from 'react'
import Connect from './screens/Connect'
import Battery from './screens/Battery'
import Login from './screens/Login'
import LastCycle from './screens/LastCycle'
import Commercial from './screens/Commercial'
import Warnings from './screens/Warnings'
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from 'react-navigation'

const DrawerNavigator = createDrawerNavigator(
  {
    Connect: {
      screen: Connect,
      navigationOptions: {
        header: null
      }
    },
    LastCycle: {
      screen: LastCycle
    },
    Commercial: {
      screen: Commercial
    },
    Warnings: {
      screen: Warnings
    }
  },
  {
    //contentComponent: props => <Sidebar2 {...props} />,
    initialRouteName: 'Connect'
  }
)

const AppStackNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Drawer: {
      screen: DrawerNavigator,
      navigationOptions: {
        header: null
      }
    },

    Battery: {
      screen: Battery,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'Login'
  }
)
const AppContainer = createAppContainer(AppStackNavigator)

export default class App extends Component {
  render() {
    return <AppContainer />
  }
}

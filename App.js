import React, { Component } from 'react'
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from 'react-navigation'

//import the required screens
import Connect from './screens/Connect'
import Battery from './screens/Battery'
import Login from './screens/Login'
import LastCycle from './screens/LastCycle'
import Commercial from './screens/Commercial'
import Warnings from './screens/Warnings'
import SideMenu from './screens/SideMenu'

//define screens which will have access to drawer
const DrawerNavigator = createDrawerNavigator(
  {
    LastCycle: {
      screen: LastCycle
    },
    Connect: {
      screen: Connect,
      navigationOptions: {
        header: null
      }
    },
    Commercial: {
      screen: Commercial
    },
    Warnings: {
      screen: Warnings
    }
  },
  {
    //to customize the drawer
    contentComponent: props => <SideMenu {...props} />,
    //starting screen of drawer
    initialRouteName: 'LastCycle'
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
    //starting route of stackNavigator
    initialRouteName: 'Login'
  }
)
const AppContainer = createAppContainer(AppStackNavigator)

export default class App extends Component {
  render() {
    return <AppContainer />
  }
}

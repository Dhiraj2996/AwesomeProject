import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Icon,
  Button
} from 'react-native'
import Speedmeter from './SpeedMeter'
import { CustomText } from '../styles/LastCyclestyles'

export default class LastCycle extends Component {
  //list have some values to be passed to speedometer

  // static navigationOptions = {
  //   headerTitle: 'Last Cycle',
  //   headerRight: (
  //     <Button
  //       onPress={() => this.props.navigation.openDrawer}
  //       title="Info"
  //       color="#fff"
  //     />
  //   )
  // }

  list = [
    {
      name: 'Charge Energy',
      value: 25,
      totalValue: 100,
      isNumber: 0
    },
    {
      name: 'Drive Energy',
      value: 75,
      totalValue: 100,
      isNumber: 0
    },
    {
      name: 'Peak Drive Current',
      value: 50,
      totalValue: 150,
      isNumber: 0
    },
    {
      name: 'Total Drive Time',
      value: 90,
      totalValue: 100,
      isNumber: 1
    },
    {
      name: 'Total Charge Time',
      value: 15,
      totalValue: 50,
      isNumber: 1
    },
    {
      name: 'Battery Pack Temperature',
      value: 23,
      totalValue: 100,
      isNumber: 0
    },
    {
      name: 'Battery Pack SOC',
      value: 50,
      totalValue: 100,
      isNumber: 0
    }
  ]

  //return colour based on percent
  getColour = (value, totalValue) => {
    tempNum = value * 100
    tempNum = tempNum / totalValue
    if (tempNum >= 75) {
      //return green
      return '#33FF33'
    } else if (tempNum <= 25) {
      //return red
      return '#ff0000'
    } else {
      //return yellow
      return '#F4D03F'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'flex-start', margin: 5 }}>
            <Button
              onPress={() => this.props.navigation.openDrawer()}
              title="Menu"
              color="#444"
            />
          </View>
          <View style={{ flex: 5 }}>
            <CustomText style={{ textAlign: 'center' }}>
              Last Cycle Data
            </CustomText>
          </View>
        </View>
        <ScrollView style={{ marginBottom: 15 }}>
          {this.list.map((item, index) => {
            return (
              <Speedmeter
                key={index}
                value={item.value}
                totalValue={item.totalValue}
                color={this.getColour(item.value, item.totalValue)}
                displayName={item.name}
                isNumber={item.isNumber}
              />
            )
          })}
        </ScrollView>
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

import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Speedmeter from './SpeedMeter'
import { CustomText } from '../styles/LastCyclestyles'

export default class LastCycle extends Component {
  //list have some values to be passed to speedometer
  list = [
    {
      value: 25,
      totalValue: 100
    },
    {
      value: 75,
      totalValue: 100
    },
    {
      value: 50,
      totalValue: 150
    },
    {
      value: 90,
      totalValue: 100
    },
    {
      value: 15,
      totalValue: 50
    },
    {
      value: 23,
      totalValue: 100
    },
    {
      value: 50,
      totalValue: 100
    }
  ]

  //the metrics are defined here
  LastCycleMetrics = [
    'Charge Capacity WH',
    'Drive Capacity',
    'Peak Discharge Current',
    'Total Drive Time',
    'Total Charge Time',
    'Average Battery Pack Temperature',
    'Peak Battery Pack Temperature'
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
        <CustomText>Last Cycle Data</CustomText>
        <ScrollView style={{ marginBottom: 15 }}>
          {this.list.map((item, index) => {
            return (
              <Speedmeter
                key={index}
                value={item.value}
                totalValue={item.totalValue}
                color={this.getColour(item.value, item.totalValue)}
                displayName={this.LastCycleMetrics[index]}
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

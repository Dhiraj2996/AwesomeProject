import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { CustomText } from '../styles/LastCyclestyles'
import WarningCard from './WarningCard'

export default class LastCycle extends Component {
  state = {
    warnings: [
      {
        date: '24/2/18',
        time: '3.40 pm',
        warning: 'Battery tempreture is high'
      },
      {
        date: '1/1/19',
        time: '5.50 pm',
        warning: 'Too much discharge current'
      }
    ]
  }
  render() {
    return (
      <View style={styles.container}>
        <CustomText>Warnings</CustomText>
        <ScrollView style={{ marginBottom: 15 }}>
          {this.state.warnings.map((item, index) => {
            return (
              <WarningCard
                key={index}
                time={item.time}
                date={item.date}
                warning={item.warning}
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

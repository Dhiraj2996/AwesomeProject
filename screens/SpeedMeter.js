import React, { Component } from 'react'
import Speedometer from 'react-native-speedometer-chart'
import { StyleSheet, View, Text } from 'react-native'
import { NameText } from '../styles/LastCyclestyles'

export default class Speedmeter extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* View can be used to give card view to speedometer
            Pass the values as per requirements */}
        {this.props.isNumber == 0 && (
          <Speedometer
            value={this.props.value}
            totalValue={this.props.totalValue}
            size={250}
            outerColor="#d3d3d3"
            internalColor={this.props.color}
            showText
            text={this.props.value}
            textStyle={{ color: this.props.color, fontSize: 20 }}
            showLabels
            labelStyle={{ color: 'blue' }}
            // showPercent
            // percentStyle={{ color: this.props.color, textAlign: 'center' }}
          />
        )}

        {this.props.isNumber == 1 && (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 30,
              color: this.props.color
            }}
          >
            {this.props.value}
          </Text>
        )}
        <NameText>{this.props.displayName}</NameText>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6',
    padding: 20,
    borderWidth: 1,
    borderColor: '#2F4F4F',
    marginTop: 15,
    flexDirection: 'column',
    elevation: 2
  },
  DrawerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    padding: 15,
    margin: 5,
    borderRadius: 2,

    textAlign: 'center'
  }
})

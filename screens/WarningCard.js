import React, { Component } from 'react'
import styled from 'styled-components'
import { View, Dimensions } from 'react-native'
import { FlexColumn, FlexRow } from '../styles/LoginStyles'
import { NameText } from '../styles/LastCyclestyles'

export default class WarningCard extends Component {
  render() {
    return (
      <Card
        style={{
          flex: 1,
          borderColor: '#2F4F4F',
          width: Dimensions.get('window').width - 20,
          backgroundColor: 'yellow',
          padding: 5
        }}
      >
        <FlexColumn style={{ flex: 0.8 }}>
          <FlexRow>
            <View style={{ flex: 1 }}>
              <SubText style={{ textAlign: 'left' }}>
                Date:{this.props.date}
              </SubText>
            </View>

            <View style={{ flex: 1 }}>
              <SubText style={{ textAlign: 'right' }}>
                Time:{this.props.time}
              </SubText>
            </View>
          </FlexRow>
          <NameText>{this.props.warning}</NameText>
        </FlexColumn>
      </Card>
    )
  }
}

const Card = styled.View`
  elevation: 4;
  margin-top: 14px;
  margin-left: 14px;
  margin-right: 14px;
  border-radius: 8px;
  border-width: 1px;
`

const SubText = styled.Text`
  height: 16px;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  color: rgba(3, 15, 41, 0.4);
`

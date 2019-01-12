import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationActions } from 'react-navigation'
import styled from 'styled-components'

export default class SideMenu extends React.Component {
  //setting avatar to a default value
  state = {
    avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png'
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <View style={{ width: '100%', marginBottom: 12 }}>
          <TouchableOpacity>
            <Image
              source={{ uri: this.state.avatar }}
              style={{
                marginTop: 15,
                height: 80,
                width: 80,
                borderRadius: 40,
                alignSelf: 'center'
              }}
            />

            <View style={{ marginTop: 12 }}>
              {/* User Name will be displayed here */}
              <NameText style={{ textAlign: 'center' }}>Hello User</NameText>
              <SubText style={{ textAlign: 'center' }}>
                Last Renewal Date: 15/11/2018
              </SubText>
              <SubText style={{ textAlign: 'center' }}>
                Next Renewal Date: 15/2/2019
              </SubText>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('LastCycle')}
        >
          <Text style={styles.DrawerItem}>LastCycle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Connect')}
        >
          <Text style={styles.DrawerItem}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Commercial')}
        >
          <Text style={styles.DrawerItem}>Commercial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Warnings')}
        >
          <Text style={styles.DrawerItem}>Warnings</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 10,
    paddingHorizontal: 20
  },
  DrawerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    padding: 15,
    margin: 5,
    borderRadius: 2,
    borderColor: '#E73536',
    borderWidth: 1,
    textAlign: 'center'
  }
})

const NameText = styled.Text`
  height: 22px;
  font-size: 17px;
  font-weight: 600;
  font-style: normal;
  color: rgba(3, 15, 41, 0.9);
`
const SubText = styled.Text`
  height: 16px;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  color: rgba(3, 15, 41, 0.4);
`

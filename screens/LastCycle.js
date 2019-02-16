import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TextInput,
  AsyncStorage
} from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import base64 from 'react-native-base64'
import { CloudUrl } from '../assests/Apiurls'
import Speedmeter from './SpeedMeter'
import { CustomText } from '../styles/LastCyclestyles'

export default class Battery extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
  }
  LastCycleDatalist = [
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

  state = {
    deviceName: 'BM70_BLE',
    stateInfo: '',
    info: '',
    values: '',
    cloudData: '',
    characteristic: '',
    device: {},
    isConnected: false,
    writeText: '',
    userId: '1',
    lastCycleStateList: [],
    labelLimits: false,
    isVerifiedCin: false
  }

  info(message) {
    this.setState({ info: message })
  }

  componentDidMount = () => {
    //get subscription
    this._retrieveData()
    this.setState({ lastCycleStateList: this.LastCycleDatalist })
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanAndConnect()
        subscription.remove()
      }
    }, true)
    console.log('Component Mounted')
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userId')
      const value2 = await AsyncStorage.getItem('deviceName')

      // console.log(value2)
      await this.setState({
        userId: value,
        deviceName: value2
      })
      console.log('name ', value2)
    } catch (error) {
      console.log(error)
    }
  }

  scanAndConnect = () => {
    //scan for devices
    this.info('Scan Called..')
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error Scanning', error)
        this.info(error)

        return
      }
      this.info('Scanning for devices...')

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === this.state.deviceName) {
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.info('Found Device ' + device.name)
        this.setState({
          // deviceName: device.name,
          stateInfo: 'device found',
          device: device
        })
        this.manager.stopDeviceScan()

        this.setupConnection(device)
      } else {
        this.setState({ info: 'no device found' })
      }
    })
  }
  setupConnection = async device => {
    const connectedDevice = await this.manager.connectToDevice(device.id)
    const servicesDiscovered = await connectedDevice.discoverAllServicesAndCharacteristics()

    let count = 0

    sub = await device.monitorCharacteristicForService(
      '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      '49535343-1e4d-4bd9-ba61-23c647249616',
      (error, data) => {
        if (error) {
          console.log('Error while monitoring::', error)
          return
        }
        //let dataRead = this.ascii_to_hex(base64.decode(data.value))
        let dataRead = this.base64ToHex(data.value)
        console.log('Read Data..::', dataRead)
        count = (count + 1) % 20
        //this.setState({ values: this.state.values + '\n' + dataRead })
        this.frame_reader(dataRead)
        if (count == 19) {
          this.sendDataToCloudApi()
        }
      }
    )
    //this.writeToDevice(this.state.device, '14')

    console.log('exiting...')
  }
  atob = input => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let str = input.replace(/=+$/, '')
    let output = ''

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      )
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer)
    }

    return output
  }
  ascii_to_hex(str) {
    var arr1 = []
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16)
      arr1.push(hex)
    }
    return arr1.join('')
  }
  base64ToHex(str) {
    for (
      var i = 0, bin = this.atob(str.replace(/[ \r\n]+$/, '')), hex = [];
      i < bin.length;
      ++i
    ) {
      let tmp = bin.charCodeAt(i).toString(16)
      if (tmp.length === 1) tmp = '0' + tmp
      hex[hex.length] = tmp
    }
    return hex.join(' ')
  }

  getWritableServicesAndCharacteristics(device) {
    return new Promise((resolve, reject) => {
      device.services().then(services => {
        const characteristics = []
        console.log('Services length:', services.length)

        services.forEach((service, i) => {
          service.characteristics().then(c => {
            characteristics.push(c)

            if (i === services.length - 1) {
              const temp = characteristics.reduce((acc, current) => {
                return [...acc, ...current]
              }, [])
              // console.log('temp in getservices::', temp)
              const dialog = temp.find(
                characteristic => characteristic.isWritableWithoutResponse
                //Specify here you want writable(with or without response) or isReadable or isNotifiable characteristic
              )
              if (!dialog) {
                reject('No writable characteristic')
              }
              resolve(dialog)
            }
          })
        })
      })
    })
  }

  writeToDevice = async (device, text) => {
    console.log('performing write..')
    let characteristic = await this.getWritableServicesAndCharacteristics(
      device
    )
    console.log('char found::', characteristic.uuid)
    await device.writeCharacteristicWithResponseForService(
      characteristic.serviceUUID,
      characteristic.uuid,
      base64.encode(text)
    )
  }
  readToDevice = async (device, characteristic) => {
    await device
      .readCharacteristicForService(
        characteristic.serviceUUID,
        characteristic.uuid
      )
      .then(value => console.log('Read Data..::', value.value))
  }

  monitorDevice = async (device, characteristic) => {
    const transactionId = 'monitor11'
    console.log('In Monitor device::' + characteristic)
    sub = await device.monitorCharacteristicForService(
      characteristic.serviceUUID,
      characteristic.uuid,
      (error, data) => {
        if (error) {
          console.log('Error while monitoring::', error)
          return
        }
        console.log('Read Data..::', data)
      },
      transactionId
    )

    setTimeout(() => this.manager.cancelTransaction(transactionId), 10000)
    console.log('Sub obj::', sub)
  }

  sendDataToCloudApi = dataToBeSent => {
    console.log('In sendDataToCloudApi')
    fetch(CloudUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.state.userId,
        dataStream: dataToBeSent
      })
    })
      .then(data => {
        return data.json()
      })
      .then(data => {
        //console.log('AddGotra Response', data)
        if (data.message == 'Data Added') {
          this.setState({ values: '' })
          console.log('Data sent to Cloud')
        } else {
          Alert.alert(
            'Error Occured while sending data to cloud! Please make sure you are connected to Internet!'
          )
        }
      })
      .catch(error => {
        console.log('Api call error')
        console.log(error.message)
      })
  }

  frame_reader(dataReceived) {
    let i = 0
    let dataToParse = dataReceived.replace(/ /g, '')
    console.log('Data To Parse:' + dataToParse)

    //dataToParse is the received dataString which has hex values

    if (!this.state.isVerifiedCin) {
      this.setState({ info: 'Waiting for Subscription Data...' })
      //get subscription data
      if (dataToParse.includes('ffaaffaa1c')) {
        //get length to read-'0x' converts hex to decimal
        let startIndex = dataToParse.indexOf('ffaaffaa1c')
        console.log('startIndex ' + startIndex)
        let subLen = parseInt(
          '0x' + dataToParse.substring(startIndex + 10, startIndex + 14)
        )
        console.log('sublen ' + subLen)

        //start reading after ffaaffaa id and length attr
        let subStart = startIndex + 14
        console.log('subStart ' + subStart)

        let subData = dataToParse.substring(subStart, subStart + subLen)
        console.log(subData)
        this.state.isVerifiedCin = true
        //console.log(parseInt('0x' + dataToParse.substring(10, 14)))
      }

      //setstate info:verifying battery
      //parse packet and match cin
      //if matched set isVerifiedCin=true and make a write to ble
      //if failed set info:invalid battery,redirect to login
      return
    }
    //labelLimits is boolean state variable(by default false) which will keep track if the labelLimits are received or not

    if (this.state.labelLimits == false) {
      //get the label limits packet first
      //parse and set values
      //set labelLimits to true
    } else {
      //since we have subscribed and limits
      this.setState({ isConnected: true })

      //get data to display
      if (dataToParse.includes('ffaaffaa1b')) {
        this.setDisplayDataValues(
          dataToParse.substring(dataToParse.indexOf('ffaaffaa1b') + 10)
        )
      }
      //get data to send to cloud
      if (dataToParse.includes('ffaaffaa1c')) {
        this.cloudDataValues(
          dataToParse.substring(dataToParse.indexOf('ffaaffaa1d') + 10)
        )
      }
    }
  }

  setDisplayDataValues(valuesData) {
    let parseLength = 3 //to ignore the packet length
    for (let parameter = 0; parameter < 7; parameter++) {
      //will not work for 3 digits
      this.LastCycleDatalist[parameter].value = parseInt(
        valuesData.substring(parseLength, parseLength + 3)
      )
      parseLength += 3
    }
    console.log(this.LastCycleDatalist)
    this.setState({ lastCycleStateList: this.LastCycleDatalist })
  }
  cloudDataValues(cloudData) {
    let parseLength = 3 //to ignore the packet length
    var datalen = cloudData.indexOf('aaffaaff')
    this.sendDataToCloudApi(cloudData.substring(0, datalen))
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isConnected && (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.welcome}>Welcome to Bluetooth Connect!</Text>
            <Text style={styles.instructions}>Battery Here</Text>
            <Text>{this.state.info}</Text>
            <Text>{this.state.deviceName}</Text>
          </View>
        )}

        {this.state.isConnected && (
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
              {this.state.lastCycleStateList.map((item, index) => {
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
        )}
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

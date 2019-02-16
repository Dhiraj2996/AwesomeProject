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
    lastCycleStateList: []
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

    this.setState({ isConnected: true })
    // const tempChar = await this.getReadableServicesAndCharacteristics(
    //   servicesDiscovered
    // )
    // this.setState({ characteristic: tempChar, device: device })
    // console.log('Is Readable::', tempChar.isReadable)
    // console.log('Read Char', tempChar)
    // await this.readToDevice(device, tempChar)
    let count = 0

    sub = await device.monitorCharacteristicForService(
      '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      '49535343-1e4d-4bd9-ba61-23c647249616',
      (error, data) => {
        if (error) {
          console.log('Error while monitoring::', error)
          return
        }
        let dataRead = this.ascii_to_hex(base64.decode(data.value))
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
  ascii_to_hex(str) {
    var arr1 = []
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16)
      arr1.push(hex)
    }
    return arr1.join('')
  }

  /*
  getNotifyServicesAndCharacteristics(device) {
    return new Promise((resolve, reject) => {
      device.services().then(services => {
        const characteristics = []

        services.forEach((service, i) => {
          service.characteristics().then(c => {
            characteristics.push(c)

            if (i === services.length - 1) {
              const temp = characteristics.reduce((acc, current) => {
                return [...acc, ...current]
              }, [])
              const dialog = temp.find(
                characteristic => characteristic.isNotifiable
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
  getReadableServicesAndCharacteristics(device) {
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
              console.log('temp in getservices::', temp)
              const dialog = temp.find(
                characteristic => characteristic.isReadable
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
  }*/
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

    // for (i = 0; i < data.length - 7; i++) {
    //   if ((data.indexOf('ffaaffaa'), i)) {
    //     console.log('index' + i + ' substr' + data.substring(i + 8, i + 9))
    //     if (data.substring(i + 8, i + 9) == '1b') {
    //       this.setDisplayDataValues(data.substring(i + 7))
    //       break
    //     }
    //   }
    // }
    let dataToParse = JSON.stringify(dataReceived)
    if (dataToParse.includes('ffaaffaa1b')) {
      this.setDisplayDataValues(
        dataToParse.substring(dataToParse.indexOf('ffaaffaa1b') + 10)
      )
    }
    if (dataToParse.includes('ffaaffaa1c')) {
      this.cloudDataValues(
        dataToParse.substring(dataToParse.indexOf('ffaaffaa1c') + 10)
      )
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
        {/* {this.state.isConnected && (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.welcome}>Welcome to Bluetooth Connect!</Text>
            <TextInput
              underlineColorAndroid="transparent"
              onChangeText={text => {
                this.setState({ writeText: text })
              }}
              style={{ flex: 2, borderWidth: 1 }}
              value={this.state.writeText}
            />
            <Button
              title="Send to Device"
              onPress={() => {
                this.writeToDevice(this.state.device, this.state.writeText)
                this.setState({ writeText: '' })
              }}
              style={{ flex: 1 }}
            />
          </View>
        )}
        <View style={{ flex: 0.1 }} />
        {this.state.isConnected && (
          <View style={{ flex: 2, borderWidth: 1, backgroundColor: '#E5E7E9' }}>
            <ScrollView>
              <Text>{this.state.values}</Text>
            </ScrollView>
          </View>
        )} */}
        {this.state.isConnected && (
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'flex-start', margin: 5 }}>
                <Button
                  onPress={() =>
                    console.log('this.props.navigation.openDrawer()')
                  }
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

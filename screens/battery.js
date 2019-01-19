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

export default class Battery extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
  }

  state = {
    deviceName: '',
    stateInfo: '',
    info: '',
    values: '',
    cloudData: '',
    characteristic: '',
    device: {},
    isConnected: false,
    writeText: '',
    userId: '1',
    deviceName: ''
  }

  info(message) {
    this.setState({ info: message })
  }

  componentDidMount = () => {
    //get subscription
    this._retrieveData()
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
          deviceName: device.name,
          stateInfo: 'device found',
          device: device
        })
        this.manager.stopDeviceScan()

        this.setupConnection(device)
      } else {
        this.setState({ deviceName: 'no device found' })
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
        let dataRead = base64.decode(data.value)
        console.log('Read Data..::', dataRead)
        count = (count + 1) % 20
        this.setState({ values: this.state.values + '\n' + dataRead })
        if (count == 19) {
          this.sendDataToCloudApi()
        }
      }
    )
    //this.writeToDevice(this.state.device, '14')

    console.log('exiting...')
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

  sendDataToCloudApi = () => {
    console.log('In sendDataToCloudApi', this.state.gotra)
    fetch(CloudUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.state.userId,
        dataStream: this.state.values
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
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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

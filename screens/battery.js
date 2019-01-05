import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BleManager } from 'react-native-ble-plx'

export default class Battery extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
    this.prefixUUID = 'f000aa'
    this.suffixUUID = '-0451-4000-b000-000000000000'
    this.sensors = {
      0: 'Temperature',
      1: 'Accelerometer',
      2: 'Humidity',
      3: 'Magnetometer',
      4: 'Barometer',
      5: 'Gyroscope'
    }
  }

  state = {
    deviceName: 'start',
    info: '',
    values: {}
  }

  serviceUUID(num) {
    return this.prefixUUID + num + '0' + this.suffixUUID
  }

  notifyUUID(num) {
    return this.prefixUUID + num + '1' + this.suffixUUID
  }

  writeUUID(num) {
    return this.prefixUUID + num + '2' + this.suffixUUID
  }

  info(message) {
    this.setState({ info: message })
  }

  error(message) {
    this.setState({ info: 'ERROR: ' + message })
  }

  updateValue(key, value) {
    this.setState({ values: { ...this.state.values, [key]: value } })
  }

  componentDidMount = () => {
    //get subscription
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanAndConnect()
        subscription.remove()
      }
    }, true)
    console.log('Component Mounted')
  }

  scanAndConnect = () => {
    //scan for devices
    console.log('Scan Called')
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error Scanning', error)

        return
      }
      console.log('Scanning for devices...')
      // if (device == null) {
      //   this.setState({ deviceName: 'no device found' })
      // } else {
      //   this.setState({ deviceName: device.name })
      // }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'BM70_BLE') {
        // Stop scanning as it's not necessary if you are scanning for one device.
        console.log('Found Device')
        this.setState({ deviceName: device.name })
        this.manager.stopDeviceScan()

        device
          .connect()
          .then(device => {
            console.log('Discovering services')
            return await device.discoverAllServicesAndCharacteristics()
          })
          .then(device => {
            // Do work on device with services and characteristics

            console.log('Writing to Device')
            console.log(device.serviceUUIDs)

            // return this.setupNotifications(device)
          })
          .catch(error => {
            console.log('error:', error)
          })

        // Proceed with connection.
      } else {
        this.setState({ deviceName: 'no device found' })
      }
    })
  }

  async setupNotifications(device) {
    const service = this.serviceUUID(3)
    //const service = '_40'
    const characteristicW = this.writeUUID(3)
    const characteristicN = this.notifyUUID(3)

    const characteristic = await device.writeCharacteristicWithResponseForService(
      service,
      characteristicW,
      'AQ==' /* 0x01 in hex */
    )

    device.monitorCharacteristicForService(
      service,
      characteristicN,
      (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Battery Here</Text>
        <Text>{this.state.deviceName}</Text>
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

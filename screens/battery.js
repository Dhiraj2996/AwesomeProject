import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { BleManager } from 'react-native-ble-plx'

export default class Battery extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
    this.prefixUUID = 'f000aa'
    this.suffixUUID = '-0451-4000-b000-000000000000'
  }

  state = {
    deviceName: '',
    stateInfo: '',
    info: '',
    values: {},
    characteristic: '',
    device: ''
  }

  // serviceUUID(num) {
  //   return this.prefixUUID + num + '0' + this.suffixUUID
  // }

  // notifyUUID(num) {
  //   return this.prefixUUID + num + '1' + this.suffixUUID
  // }

  // writeUUID(num) {
  //   return this.prefixUUID + num + '2' + this.suffixUUID
  // }

  info(message) {
    this.setState({ info: message })
  }

  // error(message) {
  //   this.setState({ info: 'ERROR: ' + message })
  // }

  // updateValue(key, value) {
  //   this.setState({ values: { ...this.state.values, [key]: value } })
  // }

  componentDidMount = () => {
    //get subscription
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanAndConnect()
        //subscription.remove()
      }
    }, true)
    console.log('Component Mounted')
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
      this.setState({ stateInfo: 'Searching for device...' })
      // if (device == null) {
      //   this.setState({ deviceName: 'no device found' })
      // } else {
      //   this.setState({ deviceName: device.name })
      // }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'BM70_BLE') {
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.info('Found Device ' + device.name)
        this.setState({ deviceName: device.name })
        this.manager.stopDeviceScan()
        this.setState({ stateInfo: 'device found' })

        // device
        //   .connect()
        //   .then(device => {
        //     console.log('Discovering services')
        //     return this.discoverServices(device)
        //   })
        //   .then(device => {
        //     // Do work on device with services and characteristics

        //     console.log('Writing to Device')
        //     console.log(device.serviceUUIDs)
        //     return this.readChars(device)
        //     // return this.setupNotifications(device)
        //   })
        //   .catch(error => {
        //     console.log('error:', error)
        //   })

        // Proceed with connection.
        this.setupConnection(device)
      } else {
        this.setState({ deviceName: 'no device found' })
      }
    })
  }
  setupConnection = async device => {
    const connectedDevice = await this.manager.connectToDevice(device.id)
    const servicesDiscovered = await connectedDevice.discoverAllServicesAndCharacteristics()
    //console.log(servicesDiscovered)

    // const tempChar = await this.getReadableServicesAndCharacteristics(
    //   servicesDiscovered
    // )
    // this.setState({ characteristic: tempChar, device: device })
    // console.log('Is Readable::', tempChar.isReadable)
    // console.log('Read Char', tempChar)
    // await this.readToDevice(device, tempChar)

    const Monitorcharacteristic = await this.getNotifyServicesAndCharacteristics(
      servicesDiscovered
    )
    console.log('Is Notifiable::', Monitorcharacteristic.isNotifiable)
    console.log('Notifiable Char::', Monitorcharacteristic)

    sub = await device.monitorCharacteristicForService(
      Monitorcharacteristic.serviceUUID,
      Monitorcharacteristic.uuid,
      (error, data) => {
        if (error) {
          console.log('Error while monitoring::', error)
          return
        }
        console.log('Read Data..::', data)
      }
    )
    console.log('Sub obj::', sub)
    console.log('exiting...')
  }
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
  }
  // async discoverServices(device) {
  //   servicesFound = await device.discoverAllServicesAndCharacteristics()
  //   console.log('services discoverd::', device.services())
  //   return servicesFound
  // }

  writeToDevice = async (device, characteristic) => {
    await device.writeCharacteristicWithResponseForService(
      characteristic.serviceUUID,
      characteristic.uuid,
      '12'
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

  // async setupNotifications(device) {
  //   const service = this.serviceUUID(3)
  //   //const service = '_40'
  //   const characteristicW = this.writeUUID(3)
  //   const characteristicN = this.notifyUUID(3)

  //   const characteristic = await device.writeCharacteristicWithResponseForService(
  //     device.serviceUUIDs,
  //     characteristicW,
  //     'AQ==' /* 0x01 in hex */
  //   )

  //   device.monitorCharacteristicForService(
  //     service,
  //     characteristicN,
  //     (error, characteristic) => {
  //       if (error) {
  //         this.error(error.message)
  //         return
  //       }
  //       this.updateValue(characteristic.uuid, characteristic.value)
  //     }
  //   )
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Bluetooth Connect!</Text>
        <Text style={styles.instructions}>Battery Here</Text>
        <Text>{this.state.info}</Text>
        <Text>{this.state.deviceName}</Text>
        <Button
          title="Read"
          onPress={() =>
            this.readToDevice(this.state.device, this.state.characteristic)
          }
        />
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

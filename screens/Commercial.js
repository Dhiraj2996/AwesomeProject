import React from 'react'
import { AppRegistry, StyleSheet, Text, View, processColor } from 'react-native'

import { SafeAreaView } from 'react-navigation'

import { PieChart } from 'react-native-charts-wrapper'

class PieChartScreen extends React.Component {
  constructor() {
    super()

    this.state = {
      legend: {
        enabled: true,
        textSize: 15,
        form: 'CIRCLE',

        horizontalAlignment: 'RIGHT',
        verticalAlignment: 'CENTER',
        orientation: 'VERTICAL',
        wordWrapEnabled: true
      },
      data: {
        dataSets: [
          {
            values: [
              { value: 45, label: 'Cumulative' },
              { value: 55, label: 'Remaining' }
            ],
            label: 'Pie dataset',
            config: {
              colors: [processColor('#C0FF8C'), processColor('#FFF78C')],
              valueTextSize: 20,
              valueTextColor: processColor('green'),
              sliceSpace: 5,
              selectionShift: 13,

              valueFormatter: "#.#'%'",
              valueLineColor: processColor('green'),
              valueLinePart1Length: 0.5
            }
          }
        ]
      },
      highlights: [{ x: 2 }],
      description: {
        text: 'This is Pie chart description',
        textSize: 15,
        textColor: processColor('darkgray')
      }
    }
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }

    console.log(event.nativeEvent)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <PieChart
            style={styles.chart}
            logEnabled={true}
            chartBackgroundColor={processColor('pink')}
            chartDescription={this.state.description}
            data={this.state.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            entryLabelColor={processColor('green')}
            entryLabelTextSize={20}
            drawEntryLabels={true}
            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={true}
            styledCenterText={{
              text: 'KWH',
              color: processColor('blue'),
              size: 20
            }}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={45}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={350}
            onSelect={this.handleSelect.bind(this)}
            onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chart: {
    flex: 1
  }
})

export default PieChartScreen

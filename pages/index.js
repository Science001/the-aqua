import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ReactSpeedometer from "react-d3-speedometer"
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aqi: 180,
      dataHistory: [
        { aqi: 150, time: '06' },
        { aqi: 160, time: '07' },
        { aqi: 170, time: '08' },
        { aqi: 200, time: '09' },
        { aqi: 180, time: '10' },
        { aqi: 160, time: '11' },
        { aqi: 130, time: '12' },
        { aqi: 140, time: '13' },
        { aqi: 150, time: '14' },
        { aqi: 180, time: '15' },
        { aqi: 210, time: '16' },
        { aqi: 180, time: '17' },
        { aqi: 165, time: '18' },
      ]
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="wrapper">
        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }} noWrap>
              {"AQUA"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div id="meterChart">
          <ReactSpeedometer minvalue={0} maxValue={500} value={this.state.aqi} startColor="#00E400" endColor="#FF0000" />
        </div>
        <Typography style={{ marginBottom: 30 }}>Current AQI</Typography>
        <div id="lineChart">
          <VictoryChart
            theme={VictoryTheme.material}
          >
            <VictoryLine
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc" }
              }}
              data={this.state.dataHistory}
              x="time"
              y="aqi"
            />
          </VictoryChart>
        </div>
        <Typography style={{ marginBottom: 30 }}>Today</Typography>
        <style jsx>{`
          .wrapper{
            margin-top: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          #lineChart {
            width: 30%;
          }
          #meterChart {
            height: 200px !important;
          }
          @media screen and (max-width: 900px) {
            #lineChart {
              width: 100%;
            } 
          }
        `}</style>
      </div>
    )
  }
}

export default App
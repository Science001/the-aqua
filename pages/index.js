import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ReactSpeedometer from "react-d3-speedometer"
import SwipeableViews from 'react-swipeable-views';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'

import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aqi: 0,
      temperature: '-',
      humidity: '-',
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
    axios.get('/api/recent-values')
      .then((res) => {
        var hcho = res.data.hcho
        var aqi = (hcho / 4) * 500
        this.setState({
          aqi: aqi,
          temperature: res.data.temperature,
          humidity: res.data.humidity,
        })
      })
    setInterval(() => {
      axios.get('/api/recent-values')
        .then((res) => {
          var hcho = res.data.hcho
          var aqi = (hcho / 4) * 500
          this.setState({
            aqi: aqi,
            temperature: res.data.temperature,
            humidity: res.data.humidity,
          })
        })
    }, 60000)
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
        <SwipeableViews enableMouseEvents id="carousel" style={{ width: "100%", backgroundColor: "#ededed" }}>
          <div className="carouselUnit">
            <div id="meterChart">
              <ReactSpeedometer minvalue={0} maxValue={500} value={this.state.aqi < 500 ? this.state.aqi : 500} startColor="#00E400" endColor="#FF0000" />
            </div>
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>Current Air Quality</Typography>
            <hr color="white" width="80%" />
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>{`Temperature: ${this.state.temperature}\u00b0F`}</Typography>
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>{`Humidity: ${this.state.humidity}%`}</Typography>
          </div>
          <div className="carouselUnit">
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
          </div>
        </SwipeableViews>
        <style jsx>{`
          .wrapper{
            margin-top: 70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .carouselUnit {
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
            margin-top: 60px;
          }
          hr {
            border: 0; 
            height: 1px; 
            background-image: -webkit-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -moz-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -ms-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -o-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); 
          }
          @media screen and (max-width: 900px) {
            #lineChart {
              width: 100%;
            } 
          }
        `}</style>
        <style global jsx>{`
          body {
            margin: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default App
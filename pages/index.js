import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ReactSpeedometer from "react-d3-speedometer"
import SwipeableViews from 'react-swipeable-views';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis } from 'victory'

import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aqi: 0,
      hcho: 0,
      temperature: '-',
      humidity: '-',
      dataHistory: [
        { aqi: 50, time: '06' },
        { aqi: 60, time: '07' },
        { aqi: 70, time: '08' },
        { aqi: 100, time: '09' },
        { aqi: 152, time: '10' },
        { aqi: 90, time: '11' },
        { aqi: 80, time: '12' },
        { aqi: 50, time: '13' },
        { aqi: 50, time: '14' },
        { aqi: 40, time: '15' },
        { aqi: 60, time: '16' },
      ]
    }
  }

  componentDidMount() {
    axios.get('/api/recent-values')
      .then((res) => {
        var aqi = res.data.aqi
        if (aqi > 500) aqi = 500
        this.setState({
          aqi: aqi,
          temperature: res.data.temperature,
          humidity: res.data.humidity,
          hcho: res.data.hcho,
        })
      })
    setInterval(() => {
      axios.get('/api/recent-values')
        .then((res) => {
          var aqi = res.data.aqi
          if (aqi > 500) aqi = 500
          this.setState({
            aqi: aqi,
            temperature: res.data.temperature,
            humidity: res.data.humidity,
            hcho: res.data.hcho,
          })
        })
    }, 60000)
  }

  getBarColor = (data) => {
    console.log(data)
    if(data.datum.aqi > 300) return '#7E0023'
    else if(data.datum.aqi > 200) return '#8F3F97'
    else if(data.datum.aqi > 150) return '#FF0000'
    else if(data.datum.aqi > 100) return '#FF7E00'
    else if(data.datum.aqi > 50) return '#FEC007'
    else return '#00E400'
  }

  getAQStatus = () => {
    var aqi = this.state.aqi
    if(aqi > 300) return 'Hazardous'
    else if(aqi > 200) return 'Very Unhealthy'
    else if(aqi > 150) return 'Unhealthy'
    else if(aqi > 100) return 'Unhealthy for Sensitive Groups'
    else if(aqi > 50) return 'Moderate'
    else return 'Good'
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
              <ReactSpeedometer minValue={0} maxValue={500} customSegmentStops={[0, 50, 100, 150, 200, 300, 500]} value={this.state.aqi < 500 ? this.state.aqi : 500} segmentColors={["#00E400", "#FEC007", "#FF7E00", "#FF0000", "#8F3F97", "#7E0023"]}/>
            </div>
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>Current Air Quality</Typography>
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>{this.getAQStatus()}</Typography>
            <hr color="white" width="80%" />
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>{`Temperature: ${this.state.temperature}\u00b0F`}</Typography>
            <Typography style={{ marginBottom: 15, marginTop: 15 }}>{`Humidity: ${this.state.humidity}%`}</Typography>
          </div>
          <div className="carouselUnit">
            <div id="lineChart">
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={20}
              >
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryBar
                  style={{ data: { fill: this.getBarColor } }}
                  data={this.state.dataHistory}
                  x="time"
                  y="aqi"
                />
              </VictoryChart>
            </div>
            <Typography style={{ marginBottom: 30 }}>Hourly Air Quality</Typography>
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
            padding: 15px;
          }
          #lineChart {
            width: 30%;
          }
          #meterChart {
            height: 200px !important;
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
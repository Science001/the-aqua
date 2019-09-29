import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ReactSpeedometer from "react-d3-speedometer"
import SwipeableViews from 'react-swipeable-views';
import { VictoryChart, VictoryBar, VictoryTheme, VictoryAxis, VictoryLegend } from 'victory'
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from 'next/link';

import Questionnaire from '../components/Questionnaire'
import Suggestions from '../components/Suggestions'

import axios from 'axios'
import { socket } from '../socket'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
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
      ],
      gotSuggestion: false,
      suggestedPlant: null,
      initialRequestOnProcess: true,
      requestOnProcess: false,
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
          toluene: res.data.toluene,
          benzol: res.data.benzol,
          initialRequestOnProcess: false,
        })
      })
      .catch(err => {
        this.setState({
          initialRequestOnProcess: false,
        })
        console.log(err)
      })
    // axios.get('/api/hourly-aqi')
    //   .then(res => {
    //     console.log(res.data)
    //     this.setState({
    //       dataHistory: res.data,
    //     })
    //   })
    socket.on('new-data', data => {
      console.log(data)
      var aqi = data.newData.aqi
      if (aqi > 500) aqi = 500
      this.setState({
        aqi: aqi,
        temperature: data.newData.temperature,
        humidity: data.newData.humidity,
        hcho: data.newData.hcho,
        toluene: data.newData.toluene,
        benzol: data.newData.benzol,
      })
    })
  }

  getBarColor = (data) => {
    if (data.datum.aqi > 300) return '#7E0023'
    else if (data.datum.aqi > 200) return '#8F3F97'
    else if (data.datum.aqi > 150) return '#FF0000'
    else if (data.datum.aqi > 100) return '#FF7E00'
    else if (data.datum.aqi > 50) return '#FEC007'
    else return '#00E400'
  }

  getAQStatus = () => {
    var aqi = this.state.aqi
    if (aqi > 300) return 'Hazardous'
    else if (aqi > 200) return 'Very Unhealthy'
    else if (aqi > 150) return 'Unhealthy'
    else if (aqi > 100) return 'Unhealthy for Sensitive Groups'
    else if (aqi > 50) return 'Moderate'
    else return 'Good'
  }

  getBorderColor = () => {
    var aqi = this.state.aqi
    if (aqi > 300) return '#7E0023'
    else if (aqi > 200) return '#8F3F97'
    else if (aqi > 150) return '#FF0000'
    else if (aqi > 100) return '#FF7E00'
    else if (aqi > 50) return '#FEC007'
    else return '#00E400'
  }

  getPlant = (body) => {
    this.setState({
      requestOnProcess: true,
    })
    console.log("Requestion plant with ", body)
    axios.post('/api/get-plant', body)
      .then(res => {
        this.setState({
          suggestedPlant: res.data,
          gotSuggestion: true,
          requestOnProcess: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          requestOnProcess: false,
        })
      })
  }

  handleDrawerToggle = () => {
    console.log('click')
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };

  render() {
    if (this.state.initialRequestOnProcess) {
      return (
        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="primary" />
        </div>
      )
    }
    else {
      const drawer = (
        <List style={{ width: 200 }}>
          <ListItem>
            <Link href='/'>
              <Typography variant="h5">{"AQUA"}</Typography>
            </Link>
          </ListItem>
          <Divider />
          <ListItem>
            <Link href='/'>
              <Typography>{"Dashboard"}</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href='/chatbot'>
              <Typography>{"Chatbot"}</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href='/leaderboard'>
              <Typography>{"Leaderboard"}</Typography>
            </Link>
          </ListItem>
        </List>
      )
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
              <img src="/static/images/apollo.png" width={"10%"} height={"10%"} />
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={this.state.drawerOpen}
            onClose={this.handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
          <SwipeableViews enableMouseEvents id="carousel" style={{ width: "100%", backgroundColor: "#ededed", marginBottom: 20 }}>
            <div className="carouselUnit">
              <Typography variant="overline" style={{ marginBottom: 15, marginTop: 15 }}>{"Maternity Ward"}</Typography>
              <div id="meterChart">
                <ReactSpeedometer minValue={0} maxValue={500} customSegmentStops={[0, 50, 100, 150, 200, 300, 500]} value={Number(this.state.aqi) < 500 ? Number(this.state.aqi) : 500} segmentColors={["#00E400", "#FEC007", "#FF7E00", "#FF0000", "#8F3F97", "#7E0023"]} />
              </div>
              <Typography style={{ marginBottom: 15, marginTop: 15 }}><b>Current Air Quality</b></Typography>
              <img src="/static/images/Legend.png" width="100%" height="100px" />
              <hr color="white" width="90%" />
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%" }}>
                <Typography style={{ margin: 15 }}>{`Temperature: ${this.state.temperature}\u00b0C`}</Typography>
                <Typography style={{ margin: 15 }}>{`Humidity: ${this.state.humidity}%`}</Typography>
              </div>
              <hr color="white" width="90%" />
              <Typography style={{ padding: 15, borderRadius: 3, border: '1px solid #000000', marginBottom: 15, marginTop: 15, backgroundColor: this.getBorderColor(), boxShadow: '0 0 5px 0 #e3e3e3' }}>{this.getAQStatus()}</Typography>
            </div>
            <div className="carouselUnit">
              <div id="lineChart">
                <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={20}
                >
                  <VictoryAxis dependentAxis label="AQI" />
                  <VictoryAxis label="Time" />
                  <VictoryBar
                    style={{ data: { fill: this.getBarColor } }}
                    data={this.state.dataHistory}
                    x="time"
                    y="aqi"
                  />
                </VictoryChart>
              </div>
              <Typography style={{ marginBottom: 30 }}>Hourly Air Quality</Typography>
              <hr color="white" width="90%" />
              <Typography style={{ margin: 15 }}>{`HCHO: ${this.state.hcho} ppm`}</Typography>
              <Typography style={{ margin: 15 }}>{`Benzol: ${this.state.benzol} ppm`}</Typography>
              <Typography style={{ margin: 15 }}>{`Toluene: ${this.state.toluene} ppm`}</Typography>
            </div>
          </SwipeableViews>
          {this.state.requestOnProcess ? <CircularProgress color="primary" /> : this.state.gotSuggestion ?
            <Suggestions plant={this.state.suggestedPlant} /> :
            this.state.aqi > 50 ?
              <Questionnaire getPlant={this.getPlant} /> :
              <div id="okCard"><Typography variant="overline">It's all good!</Typography></div>
          }
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
            marginTop: 30px;
            height: 175px !important;
          }
          hr {
            border: 0; 
            height: 1px; 
            background-image: -webkit-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -moz-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -ms-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0);
            background-image: -o-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0); 
          }
          #okCard {
            margin-top: 20px;
            width: 90%;
            padding: 20px 10px;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 0 5px 0 #00E676;
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
}

export default App
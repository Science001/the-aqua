import React from 'react'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import CircularProgress from '@material-ui/core/CircularProgress'

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from 'next/link';

import TrendingUp from '@material-ui/icons/TrendingUp'
import TrendingDown from '@material-ui/icons/TrendingDown'
import TrendingFlat from '@material-ui/icons/TrendingFlat'
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios'

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      rankings: [],
      onLoad: true,
    }
  }

  componentDidMount() {
    axios.get('/api/leaderboard')
      .then((res) => {
        this.setState({
          rankings: res.data,
        })
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        this.setState({
          onLoad: false,
        })
      })
  }

  getLogo = val => {
    if (val === 0) return <TrendingFlat style={{ color: 'grey' }} />
    else if (val > 0) return <TrendingUp style={{ color: 'green' }} />
    else return <TrendingDown style={{ color: 'red' }} />
  }

  handleDrawerToggle = () => {
    console.log('click')
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };

  render() {
    if (this.state.onLoad) {
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
        <div>
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
                {"AQUA - Leaderboard"}
              </Typography>
              <img src="static/images/aqua grade.png" style={{marginRight: 10}} />
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
          <div style={{ marginTop: 70 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"Rank"}</TableCell>
                  <TableCell>{"Hospital"}</TableCell>
                  <TableCell>{"Level"}</TableCell>
                  <TableCell>{"+/-"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rankings.map(row => (
                  <TableRow key={row.rank}>
                    <TableCell component="th" scope="row">
                      {row.rank}
                    </TableCell>
                    <TableCell>{row.hospital}</TableCell>
                    <TableCell>
                      <img src={`/static/images/${row.level}.png`} height="25%" />
                    </TableCell>
                    <TableCell>{this.getLogo(row.progress)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )
    }
  }
}
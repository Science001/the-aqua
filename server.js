// Imports
const express = require('express')
const next = require('next')
const session = require('express-session')
const morgan = require('morgan')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    // Initialize --------------------------------------------------------------------
    const server = express()
    const httpServer = require('http').Server(server)
    const io = require('socket.io')(httpServer)
    require('dotenv').config()
    server.use(morgan('dev'))
    server.use(session({
      name: 'sessionID',
      secret: 'averyrandommixedrealitybasedarvrgoodbadseesunrisefrommselfwecanridesseeyouthroughmylucideyesftw',
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
      resave: true,
      saveUninitialized: false
    }))
    const port = process.env.PORT
    // -------------------------------------------------------------------------------

    server.use('/api', (req, _res, next) => {
      req.io = io
      next()
    }, require('./api'))

    io.on('connection', _socket => {
      console.log("New Connection to Socket")
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    httpServer.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on port ${port}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })  
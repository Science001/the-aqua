const express = require("express");
const api = express.Router();
const crypto = require('crypto');

//Body Parser ------------------------------------------------
const bodyParser = require('body-parser')
api.use(bodyParser.json())
//------------------------------------------------------------

//Database ---------------------------------------------------
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//------------------------------------------------------------




// Helpers -----------------------------------------------------------------------
function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pdkdf2", "10000", salt, hashed.toString('hex')].join('$');
}
// -------------------------------------------------------------------------------

//Code Starts here ---------------------------------------------------------------
api.get('/', (req, res) => {
    res.send({ message: "Team 13, FTW!" })
})

api.get('/all-sensor-data', (req, res) => {
    pool.query("select * from sensor_data", (err, result) => {
        if (err) {
            console.log("Error getting sensor data: ", err)
            res.status(500).send(err)
        }
        else {
            res.send(result.rows)
        }
    })
})

api.post('/sensor-data', (req, res, next) => {
    var { temperature, humidity, hcho, aqi } = req.body
    if (!temperature || !humidity || !hcho || !aqi) {
        res.status(400).send("Not all expected data was sent")
    }
    else next()
}, (req, res) => {
    console.log("SENSOR DATA:", req.body)
    var { temperature, humidity, hcho, aqi } = req.body
    pool.query("insert into sensor_data(hcho, temperature, humidity, aqi) values ($1, $2, $3, $4)", [hcho, temperature, humidity, aqi], (err, _) => {
        if (err) {
            console.log("Error inserting sensor data: ", err)
            res.status(500).send(err)
        }
        else {
            res.send("INSERTED INTO DB")
        }
    })
})

api.get('/recent-values', (req, res) => {
    pool.query("select * from sensor_data order by sent_on desc limit 1", (err, result) => {
        if (err) {
            console.log("Error getting sensor data: ", err)
            res.status(500).send(err)
        }
        else {
            res.send(result.rows[0])
        }
    })
})

api.use('/dialogflow', require('./dialogflow'))

module.exports = api;
const express = require("express");
const api = express.Router();
const crypto = require('crypto');
const { WebhookClient } = require('dialogflow-fulfillment');

//Body Parser ------------------------------------------------
const bodyParser = require('body-parser')
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }));
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

function getAQStatus(aqi) {
    if (aqi > 300) return 'Hazardous'
    else if (aqi > 200) return 'Very Unhealthy'
    else if (aqi > 150) return 'Unhealthy'
    else if (aqi > 100) return 'Unhealthy for Sensitive Groups'
    else if (aqi > 50) return 'Moderate'
    else return 'Good'
}
// -------------------------------------------------------------------------------

// DialogFlow Helpers -----------------------------------------------------------------------
function welcome(agent) {
    agent.add(`Welcome to Express.JS webhook!`);
}

function fallback(agent) {
    agent.add(`I didn't understand`);
}

function get_info_aqi(agent) {
    return new Promise((resolve, _reject) => {
        pool.query('select aqi from sensor_data order by sent_on desc limit 1', (err, result) => {
            if (err) {
                agent.add("Something's wrong")
                resolve()
            }
            else {
                agent.add(`The air quality is ${getAQStatus(result.rows[0].aqi)}. The AQI is ${result.rows[0].aqi}.`)
                resolve()
            }
        })
    })
}

function get_info_exposure(agent) {
    return new Promise((resolve, _reject) => {
        pool.query('with e as (select aqi from sensor_data order by sent_on desc limit 100) select count(*) from e where e.aqi>50', (err, result) => {
            if (err) {
                agent.add("Something's wrong")
                resolve()
            }
            else {
                var hit = (result.rows[0].count) - 50
                agent.add(`Your have been exposed ${Math.abs(hit)}% ${hit < 0 ? 'less' : 'more'} to pollution than optimal.`)
                resolve()
            }
        })
    })
}

function get_time(agent) {
    return new Promise((resolve, _reject) => {
        pool.query('select now()', (err, result) => {
            if (err) {
                agent.add("Something's wrong")
                resolve()
            }
            else {
                agent.add(`The current time is ${result.rows[0].now}`)
                resolve()
            }
        })
    })
}

function WebhookProcessing(req, res) {
    const agent = new WebhookClient({ request: req, response: res });
    console.info(`agent set`);

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('get_time', get_time);
    intentMap.set('get_info_aqi', get_info_aqi);
    intentMap.set('get_info_exposure', get_info_exposure);
    agent.handleRequest(intentMap);
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

api.post('/dialogflow', function (req, res) {
    console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
    WebhookProcessing(req, res);
});

module.exports = api;
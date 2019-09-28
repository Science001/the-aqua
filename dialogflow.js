const express = require("express");
const dialogflow = express.Router();
const { WebhookClient } = require('dialogflow-fulfillment');

//Body Parser ------------------------------------------------
const bodyParser = require('body-parser')
dialogflow.use(bodyParser.json())
dialogflow.use(bodyParser.urlencoded({ extended: true }));
//------------------------------------------------------------

//Database ---------------------------------------------------
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
//------------------------------------------------------------

// Helpers ---------------------------------------------------
function getAQStatus(aqi) {
    if (aqi > 300) return 'Hazardous'
    else if (aqi > 200) return 'Very Unhealthy'
    else if (aqi > 150) return 'Unhealthy'
    else if (aqi > 100) return 'Unhealthy for Sensitive Groups'
    else if (aqi > 50) return 'Moderate'
    else return 'Good'
}

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
                agent.add(`Your have been exposed ${Math.abs(hit)}% ${hit < 0 ? 'less' : 'more'} to pollution than the threshold.`)
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
//------------------------------------------------------------

dialogflow.post('/', function (req, res) {
    console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
    WebhookProcessing(req, res);
});

module.exports = dialogflow;
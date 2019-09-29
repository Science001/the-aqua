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
function runPythonScript(params) {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python', ["./get_best_plant.py", params.join(',')]);
  return new Promise((resolve, _reject) => {
    pythonProcess.stdout.on("data", data => {
      resolve(data.toString()); // <------------ by default converts to utf-8
    })
  })
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
  var { temperature, humidity, hcho, aqi, toluene, benzol } = req.body
  if (!temperature || !humidity || !hcho || !aqi || !toluene || !benzol) {
    res.status(400).send("Not all expected data was sent")
  }
  else next()
}, (req, res) => {
  console.log("SENSOR DATA:", req.body)
  var { temperature, humidity, hcho, aqi, toluene, benzol } = req.body
  pool.query("insert into sensor_data(hcho, temperature, humidity, aqi, toluene, benzol) values ($1, $2, $3, $4, $5, $6) returning *", [hcho, temperature, humidity, aqi, toluene, benzol], (err, result) => {
    if (err) {
      console.log("Error inserting sensor data: ", err)
      res.status(500).send(err)
    }
    else {
      res.send("INSERTED INTO DB")
      console.log("To emit: ", result.rows[0])
      req.io.emit('new-data', { newData: result.rows[0] })
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

api.get('/hourly-aqi', (req, res) => {
  pool.query('select trunc(EXTRACT(hour from sent_on)) as time, ROUND(avg(aqi), 2) as aqi from sensor_data group by trunc(EXTRACT(hour from sent_on)) order by time', (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error getting hourly aqi" })
    }
    else {
      res.send(result.rows)
    }
  })
})

api.post('/get-plant', (req, res) => {
  console.log('got a request for plant', req.body)
  var { headache, nausea, dizziness, tightnessInChest, noseIrritation, throatIrritation, shortnessOfBreath } = req.body
  var params = [headache, nausea, dizziness, tightnessInChest, noseIrritation, throatIrritation, shortnessOfBreath]
  if (headache === 0 && nausea === 0 && dizziness === 0 && tightnessInChest === 0 && noseIrritation === 0 && throatIrritation === 0 && shortnessOfBreath === 0) {
    res.send(null)
  }
  else {
    runPythonScript(params)
      .then(index => {
        pool.query('select name, image from plant where id=$1', [index], (err, result) => {
          if (err) {  
            res.status(500).send({ message: "Something went wrong" })
            console.log(err)
          }
          else {
            res.send(result.rows[0])
          }
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })
  }
})

api.use('/dialogflow', require('./dialogflow'))

module.exports = api;
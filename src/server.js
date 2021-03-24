const express = require('express');
var request = require('request');
const bodyParser = require('body-parser')
const path = require('path');
var cors = require('cors')

const app = express();
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));

app.get('/clock', (req, res) => {
    request("http://worldtimeapi.org/api/timezone/America/Argentina/Salta", (err, response, body) => {
        if (!err && response.statusCode == 200) {
            const parsedBody = JSON.parse(body)
            const currentDate = new Date()
            const timezoneOffsetInMiliseconds = currentDate.getTimezoneOffset() * 60000
            const responseTimeZoneOffsetInMiliseconds = parsedBody.raw_offset * 1000
            const rawOffset = timezoneOffsetInMiliseconds + responseTimeZoneOffsetInMiliseconds
            const responseDate = currentDate.getTime() + rawOffset
            res.json(new Date(responseDate))
        } else {
            res.sendStatus(response.statusCode)
        }
    })
})

app.listen(8000, ()=> {
    console.log("Server is up and running")
});

'use strict';


const fs = require('fs');


const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/vytvorJSONData', (req, res) => {


    let data = JSON.stringify(req.body, null, 2);
    
    fs.writeFile('student-3.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    
    console.log('This is after the write call');


})


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


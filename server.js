var fs = require('fs');
var http = require('http');
var https = require('https');
var axios = require('axios');
var btoa = require('btoa');
var privateKey  = fs.readFileSync('sslcert/key.pem');
var certificate = fs.readFileSync('sslcert/cert.pem');
const port = 8080;

var credentials = {
    key: privateKey, 
    cert: certificate
};

var express = require('express');
var app = express();

const apiOptions = {
    url: 'http://192.168.4.34:7110',
    user: 'rwspu',
    pass: 'restws'
};

const headers = {
    'Content-Type':  'application/json',          
    'Authorization' : 'Basic ' + btoa(apiOptions.user + ":" + apiOptions.pass)
}

 app.post('/*', function(req,res) {
   let currentPath = req.path;
   let body = [];

   req.on('error', (err) => {

     res.json(err.message);

   }).on('data', (chunk) => {

     body.push(chunk);

   }).on('end', () => {

     body = Buffer.concat(body).toString();
     // al obtener el body, se reenvia a la api
     axios({
        method: 'post', 
        url: apiOptions.url + currentPath, 
        data: body, 
        headers: headers })
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            res.json(error.message);
        });

   });
   
 });
 
 /*
 var server = https.createServer(credentials, app);
 
 server.listen(port, () => {
   console.log("server starting on port : " + port)
 });
*/

var http = http.createServer(app);
http.listen(port, () => {
  console.log("server starting on port : " + port)
});
// grab the packages we need
var express = require('express');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var dbs = require('./databaseStuff');
var fs = require('fs');
var dksjfhcz = 'hades666'

var app = express();
var port = 8080;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.listen(port);



/*
    From <https://www.w3schools.com/nodejs/nodejs_url.asp>
    and <https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters>
*/

app.get('/memory', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="memory/fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('Device name: <input type="text" name="device"><br>');
    res.write('To secret password: <input type="password" name="password"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

// routes will go here
app.post('/memory/fileupload', function (req, res) {
    var device = '';
    // console.log(req.headers);
    var form = new formidable.IncomingForm();
    // console.log(form);
    // console.log(req);
    console.log('before parsing');
    form.parse(req, function (err, fields, files) {
        console.log('inside parsing');
        if (fields.password !== dksjfhcz) return;
        device = fields.device;
        // dbs.createDatabase();
        

        let historyLines = dbs.processHistoryFile(files, device);
        if (historyLines.length > 0) {

            dbs.insertHistoryLineIntoDb(historyLines);
        } else {
            console.log("Nothing inserted !");
        }
        // fs.readFile(files.filetoupload.path, 'utf8', function(err, contents) {
        //     console.log(contents);
        // });

        // var oldpath = files.filetoupload.path;
        // var newpath = '/home/icare/pinode/uploaded/' + files.filetoupload.name;
        // fs.rename(oldpath, newpath, function(err) {
        //     if ( err ) console.log('ERROR: ' + err);
        //     console.log('File uploaded and moved!');
        // });
    });
    res.send(`received information from ${device} `);
});
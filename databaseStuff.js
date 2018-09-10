var fs = require('fs');
var mongo = require('mongodb');


exports.createDatabase = function() {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/mydb";
    MongoClient.connect(url, function(err, db) {
    //   if (err) throw err;
    var dbo = db.db("mydb");
      console.log("Database created!");
      db.close();
    });
}

exports.insertHistoryLineIntoDb = function (historyLines) {
    if (!Array.isArray(historyLines) && historyLines.length > 0) return;
    console.log(historyLines);
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/mydb";
    MongoClient.connect(url, function(err, db) {
        //   if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("history").insertMany(historyLines, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
          });
        });
}

exports.processHistoryFile = function (files, device) {
    console.log(Object.keys(files));
    console.log(files['filetouplad']);
    var lineReader;
    // Black magic
    if (files['filetouplad']) {
        lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(files['filetouplad'].path)
        });
    } else {
        lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(files.filetoupload.path)
        });
    }
    let allObj = [];
    lineReader.on('line', function (line) {
        // Check if it is an history line
        let check = /^\s*([0-9]*)  .*$/.test(line);
        if (check) {
            let myRegexp = /^\s*([0-9]*)(.*)/g;
            let match = myRegexp.exec(line)
            console.log(match);
            allObj.push({ date: Date.now(), historyLine: match[0], device: device, lineIndex : match[1] });
        }  else {
            // console.log('Ignored line content:');
            // console.log(line);
        }
    });
    return allObj;
}
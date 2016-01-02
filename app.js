#!/usr/bin/env node
var readability = require('node-readability');
var htmlToText = require('html-to-text');
var express = require('express');
var app = express();
var port = process.env.PORT || 8081;

// routes will go here
app.get('/api/rss', function (req, res, next) {

  if (req.params('url') != undefined) {
      scraper(req.params('url'), function (data) {
          res.send(JSON.stringify(data));
      });
  }else{
      res.send('error');
  }

});


// start the server
app.listen(port);

//helper functions
function scraper(urlPassedIn, callback) {
    console.log(urlPassedIn);
    readability(urlPassedIn, function(err, article, meta) {
        console.log("readability returned");

        if(article == undefined || article.content == undefined){
            var obj = {
                "url": urlPassedIn,
                "title": "too long",
                "contents": "too long"
            };
            if(article != undefined)
                article.close();

        }else {

            if (err && article.content != "") {
                console.log(err);
                throw err;
            }

            var text = htmlToText.fromString((article.content || ""), {
                wordwrap: 130
            });

            var obj = {
                "url": urlPassedIn,
                "title": article.title,
                "contents": text
            };
            article.close();
            callback(obj);
        }

    });

}

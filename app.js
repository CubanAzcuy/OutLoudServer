#!/usr/bin/env node
var http = require('http');
var readability = require('node-readability');
var htmlToText = require('html-to-text');
var urlTest = require('url');

var server = http.createServer(

    function (request, response) {

        if(request.method == 'GET') {

            var url_parts = urlTest.parse(request.url, true);
            console.log("GET");
            response.writeHead(200);
            var string = url_parts.query.url;

            if (string != undefined) {
                scraper(string, function (data) {
                    console.log(JSON.stringify(data));
                    response.write(JSON.stringify(data));
                    response.end();
                });
            }else{
                response.end();

            }

        }
    }
);

server.listen(8080);

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
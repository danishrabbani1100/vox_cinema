let db                   = require('./../models/db'),
    config               = require('./../config').config,
    moment               = require('moment'),
    md5                  = require('md5'),
    request              = require('request'),
    _this                = this;


exports.getMovies = function(req, res) {
    let query = `SELECT * FROM movies`;
    console.log(query);
    db.readOperation(query, (data) => {
        if (data.success) {
            res.json(data);
        } else res.json(data);
    });
};

exports.getMovieByName = function(req, res) {

    if (req.query.name == undefined || req.query.name == null || req.query.name.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "name parameter is missing!";
        res.send(err);
        return;
    }

    let query = `SELECT * FROM movies where title LIKE '${req.query.name}'`;
    console.log(query);
    db.readOperation(query, (data) => {
        if (data.success) {
            res.json(data);
        } else res.json(data);
    });
};

exports.sendCarousel = function(req, res) {

    if (req.query.user_id == undefined || req.query.user_id == null || req.query.user_id.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "user id parameter is missing!";
        res.send(err);
        return;
    }
    let user_id = req.query.user_id,
        pageToken = 'EAAODA7mNZCbIBAM3fPKK3YLkj95tqF7WlxIOBMFccJdZAcwYZA4HHypAZBQXY2Xalvuj97SCGxSM9FjvJPSMqJwWXW36sSCU22wB5Y4ZCmkMkmbXZAyB0hnKiPigsn4jqVmp3vf633nNc5gU7PKf6A9ZAZBiuhZA7xZCMgQsLZCNuOQrSjj1r354Jxl',
        url = `https://graph.facebook.com/v2.6/me/messages?access_token=${pageToken}`;

    let query = `SELECT * FROM movies`;
    console.log(query);
    db.readOperation(query, (data) => {
        if (data.success) {

            let elements = [],
                movies = data.data,
                len = 10;

            if(movies.length < 10){
                len = movies.length;
            }


            for(let i=0; i<len; i++) {
                elements.push(
                    {
                        "title": "" + movies[i].title,
                        "image_url": "" + movies[i].image_url,
                        "buttons":[
                            {
                                "type": "postback",
                                "title": "Get Tickets",
                                "payload": "" + movies[i].id
                            }
                        ]
                    }
                );
            }

            let json = {
                "recipient": {
                    "id": "" + user_id
                },
                "message": {
                    "attachment": {
                        "type":"template",
                        "payload": {
                            "template_type":"generic",
                            "elements": elements
                        }
                    }

                }
            };

            res.json(data);

            request({
                url: url,
                method: "POST",
                json: true,   // <--Very important!!!
                body: json
            }, function (error, response, body){
                console.log(response);
            });


            //res.json(data);
        } else res.json(data);
    });
};
exports.showTimeCarousel = function(req, res) {

    if (req.query.user_id == undefined || req.query.user_id == null || req.query.user_id.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "user id parameter is missing!";
        res.send(err);
        return;
    }
    let user_id = req.query.user_id,
        pageToken = 'EAAODA7mNZCbIBAM3fPKK3YLkj95tqF7WlxIOBMFccJdZAcwYZA4HHypAZBQXY2Xalvuj97SCGxSM9FjvJPSMqJwWXW36sSCU22wB5Y4ZCmkMkmbXZAyB0hnKiPigsn4jqVmp3vf633nNc5gU7PKf6A9ZAZBiuhZA7xZCMgQsLZCNuOQrSjj1r354Jxl',
        url = `https://graph.facebook.com/v2.6/me/messages?access_token=${pageToken}`;

    let query = `SELECT * FROM movies`;
    console.log(query);
    db.readOperation(query, (data) => {
        if (data.success) {

            let elements = [],
                movies = data.data,
                len = 10;

            if(movies.length < 10){
                len = movies.length;
            }


            for(let i=0; i<len; i++) {
                elements.push(
                    {
                        "title": "" + movies[i].title,
                        "image_url": "" + movies[i].image_url,
                        "buttons":[
                            {
                                "type": "web_url",
                                "title": "Show Time",
                                "url": "https://uae.voxcinemas.com/movies/" + movies[i].stime_postback + "#showtimes",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": "false"
                            }
                        ]
                    }
                );
            }

            let json = {
                "recipient": {
                    "id": "" + user_id
                },
                "message": {
                    "attachment": {
                        "type":"template",
                        "payload": {
                            "template_type":"generic",
                            "elements": elements
                        }
                    }

                }
            };

            res.json(data);

            request({
                url: url,
                method: "POST",
                json: true,   // <--Very important!!!
                body: json
            }, function (error, response, body){
                console.log(response);
            });


            //res.json(data);
        } else res.json(data);
    });
};

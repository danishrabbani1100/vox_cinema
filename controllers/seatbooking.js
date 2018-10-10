let db                   = require('./../models/db'),
    config               = require('./../config').config,
    moment               = require('moment'),
    md5                  = require('md5'),
    cons                 = require('consolidate'),
    request              = require('request'),
    _this                = this;


exports.bookSeats = function(req,res) {
    let seats = req.body.seats,
        movie_id = req.body.id,
        show_date = req.body.date,
        user_id = req.body.user_id,
        cinema_id =  req.body.cinema_id,
        query = 'INSERT INTO tickets (movie_id, seat_number, booking_date, user_id, cinema_id) VALUES ?',
        values = [];

    let pageToken = 'EAAGp38xLPpABACXnZBIgK5JtAl31aoDA8Sf8PSZBGVlknf1opnuZAJC9UmRdQ2svZBVhRLLpvobHRrXNW94OOL4bZB71GCIulZADBJklJrSEMlAWbl8oxO8RRVzi2ZCKejoouHFFdZAdZCrsf2OfrFDfoCJ079glW6ZAp6tsbFUGYxY76czwSvFDlNAT3rJEr4m3EZD',
        message = '',
        sendMessageURL = 'https://bots.mercurialminds.com/fb-forward-msg.jsp';

    if(seats.length > 1){
        message = 'Dear user, your tickets have been booked. Your seat numbers are ' + seats.join(',') + '. Please collect ticket 15 minutes before the start of the movie and make the payment then and there. Thank You.';
    }else{
        message = 'Dear user, your ticket has been booked. Your seat number is ' + seats[0] + '. Please collect ticket 15 minutes before the start of the movie and make the payment then and there. Thank You.';
    }

    for(let i =0; i<message.length; i++){
        if(message.indexOf(' ')>=0){
            message = message.replace(' ','%20');
        }
    }

    for(let i=0; i< seats.length; i++){
        values.push([movie_id, seats[i], show_date, user_id, cinema_id]);
    }

    db.insertBulk(query,values, (data) => {
        if (data.success) {
            console.log('success');
            request.get(sendMessageURL + `?id=${user_id}&msg=${message}&access_token=${pageToken}`);
        } else res.json(data);
    });

};

exports.renderSeats = function(req, res) {

    if (req.query.cinema_id == undefined || req.query.cinema_id == null || req.query.cinema_id.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "cinema id parameter is missing!";
        res.send(err);
        return;
    }

    if (req.query.id == undefined || req.query.id == null || req.query.id.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "id parameter is missing!";
        res.send(err);
        return;
    }
    if (req.query.date == undefined || req.query.date == null || req.query.date.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "date parameter is missing!";
        res.send(err);
        return;
    }
    if (req.query.user == undefined || req.query.user == null || req.query.user.trim() == '') {
        var err = {};
        err.status = "Error";
        err.msg = "user parameter is missing!";
        res.send(err);
        return;
    }


    let query = `SELECT seat_number FROM tickets WHERE movie_id = ${req.query.id} AND cinema_id = ${req.query.cinema_id} AND show_date LIKE '${req.query.date}'`;
    console.log(query);
    db.getSeats(query, (data) => {
        if (data.success) {
            //res.json(data);
            res.render('bookseat.ejs',{reservedSeats : data.data, movie_id: req.query.id, show_date: req.query.date, user_id: req.query.user, cinema: req.query.cinema_id});
        } else res.json(data);
    });

};
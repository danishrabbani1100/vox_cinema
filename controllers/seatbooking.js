let db                   = require('./../models/db'),
    config               = require('./../config').config,
    moment               = require('moment'),
    md5                  = require('md5'),
    cons                 = require('consolidate'),
    request              = require('request'),
    _this                = this,
    seatsArr             = [];


exports.paymentDetails = function(req,res) {
    let seats = req.body.seats,
        movie_id = req.body.id,
        show_date = req.body.date,
        user_id = req.body.user_id,
        cinema_id =  req.body.cinema_id;
    res.render('payment.ejs',{seatsToReserve : seats, movie_id: movie_id, show_date: show_date, user_id: user_id, cinema: cinema_id});

};
exports.bookSeats = function(req,res) {
    let seats = req.body.seats,
        movie_id = req.body.id,
        show_date = req.body.date,
        user_id = req.body.user_id,
        cinema_id =  req.body.cinema_id,
        query = 'INSERT INTO tickets (movie_id, seat_number, show_date, user_id, cinema_id) VALUES ?',
        values = [];

    let pageToken = 'EAAEZAZABbZBwpgBAENAtbwhGHGVFzizG9fImZBgAOuxOn1DpqzUbEUSgjF1HXKf8gjkukal7RPxngQm6air69Kkn5N3sg296l4BScBksZCiV3Le2ZCFe0jLilJbZCO6Us7MDSZAw1npcbroAMH7N9wCdgVixG0rQlXz9hsP05HcZAMjMx1JZB77KMrioQhdwwzZBDQZD',
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
            query = `select movies.title, cinemas.cinema, cinemas.city from movies,cinemas where movies.id = ${movie_id} AND cinemas.id = ${cinema_id}`;
            db.readOperation(query, (result) => {
                if(result.success) {
                   message = `Dear customer, your seat ${seats.join(',')} has been confirmed at ${result.data[0].cinema} in ${result.data[0].city} on ${show_date} for the movie ${result.data[0].title}. Please collect ticket at the ticket counter. Thank You`;
                    console.log('success');
                    request.get(sendMessageURL + `?id=${user_id}&msg=${message}&access_token=${pageToken}`);
                }

            });
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

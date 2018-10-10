let createError  = require('http-errors'),
    express      = require('express'),
    path         = require('path'),
    body_parser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger       = require('morgan'),
    router       = require('./controllers'),
    consolidate  = require('consolidate'),
    app = express();

app.use(body_parser.urlencoded({extended : false}));
app.use(body_parser.json());

// Routes Base Path
app.use('/vox_cinemas', router);

// view engine setup
//app.engine('html',consolidate.handlebars);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error   = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const port = process.env.PORT;
app.listen(port, function () {
    console.log("Server is running on port", port);
});

module.exports = app;

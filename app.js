var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require("helmet");

var manufacturerRouter = require('./routes/manufacturer');
var collectorRouter = require('./routes/collector');
var customerRouter = require('./routes/customer');
var ordersRouter = require('./routes/orders');
var paymentRouter = require('./routes/payment');
var productRouter = require('./routes/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

app.use('/manufacturers', manufacturerRouter);
app.use('/collectors', collectorRouter);
app.use('/customers', customerRouter);
app.use('/orders', ordersRouter);
app.use('/payments', paymentRouter);
app.use('/products', productRouter)

app.use(helmet())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page  IMPORTANT
  res.status(err.status || 500);
  res.json({
    status:err.message || 500,
    message: err.message
  })
  res.render('error');
});

module.exports = app;

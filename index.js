require('dotenv').config();
const express = require('express');
const http = require('http');
const wechat = require('wechat');
const app = express();
const router = express.Router();

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
};


app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  var message = req.weixin;
  console.log(message);
  res.reply(message);
}));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

server.listen(port);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
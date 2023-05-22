/**
 * Ö÷ÎÄ¼þ app.js
 */

var express = require('express');
var http = require('http');
//var https = require('https');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var errorhandler = require('errorhandler');

var router = require('./routes/router');    // App µÄ×Ô¶¨ÒåÂ·ÓÉÐÅÏ¢

var AppConfig = require('./app-config.json');    // AppConfig

var app = express();


// ====================  App ÉèÖÃ  ====================

app.set('port', AppConfig.server.server_port);    // ¶Ë¿ÚÉèÖÃ
app.set('views', path.join(__dirname, 'views'));    // ÉèÖÃÊÓÍ¼ View ËùÔÚµÄÂ·¾¶
app.set('view engine', 'ejs');    // html Ä£°åÒýÇæ



// ====================  ÖÐ¼ä¼þÉèÖÃ(Ë³ÐòºÜÖØÒª)  ====================

app.use(logger('dev'));    // ¿ª·¢ÈÕÖ¾
// ·ÃÎÊÈÕÖ¾
// var access_log_file = fs.createWriteStream('./log/access_log.log', { flags: 'a', encoding: 'utf8' });    // ·ÃÎÊÈÕÖ¾ÎÄ¼þ
// app.use(express.logger({stream: access_log_file}));

//app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));    // favicon Â·¾¶
// app.use(express.bodyParser());    // ²»¼æÈÝÎÄ¼þÉÏ´«
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({secret: 'sessiontest'}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));    // ¾²Ì¬ (images + css + js + fonts) ×ÊÔ´ËùÔÚµÄÂ·¾¶ (¿ÉÒÔÉèÖÃ¶à¸ö)

//app.use(app.router);

if ('development' == app.get('env')) {    // ¿ª·¢»·¾³ÏÂµÄ´íÎó´¦Àí
  app.use(errorhandler());
}


// ====================  ×Ô¶¨ÒåÂ·ÓÉÐÅÏ¢  ====================

router.map(app);


// ====================  ´´½¨ http ·þÎñÆ÷  ====================

http.createServer(app).listen(app.get('port'), function(){
    console.log('doc4doc app server listening on port ' + app.get('port'));
});


// ====================  ´´½¨ https ·þÎñÆ÷  ====================

/*
var options = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/certificate.crt')
};

https.createServer(options, app).listen(app.get('port'), function(){
  console.log('antark server listening on port ' + app.get('port'));
});


app.use((req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    next();
});
*/


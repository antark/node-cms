/**
 * 主文件 app.js
 */

var express = require('express');
var http = require('http');
// var https = require('https');
var path = require('path');
var fs = require('fs');
var router = require('./routes/router');    // App 的自定义路由信息

var app = express();


// ====================  App 设置  ====================

app.set('port', process.env.PORT || process.env.APP_PORT || 3000);    // 端口设置
app.set('views', path.join(__dirname, 'views'));    // 设置视图 View 所在的路径
app.set('view engine', 'ejs');    // html 模板引擎



// ====================  中间件设置(顺序很重要)  ====================

app.use(express.logger('dev'));    // 开发日志
// 访问日志
// var access_log_file = fs.createWriteStream('./log/access_log.log', { flags: 'a', encoding: 'utf8' });    // 访问日志文件
// app.use(express.logger({stream: access_log_file}));

app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));    // favicon 路径
// app.use(express.bodyParser());    // 不兼容文件上传
app.use(express.json());
app.use(express.urlencoded());

app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));    // 静态 (images + css + js + fonts) 资源所在的路径 (可以设置多个)

app.use(app.router);

if ('development' == app.get('env')) {    // 开发环境下的错误处理
  app.use(express.errorHandler());
}


// ====================  自定义路由信息  ====================

router.map(app);


// ====================  创建 http 服务器  ====================

http.createServer(app).listen(app.get('port'), function(){
    console.log('Qingci app server listening on port ' + app.get('port'));
});


// ====================  创建 https 服务器  ====================
/*
var options = {
  key: fs.readFileSync('./cert/privatekey.pem'),
  cert: fs.readFileSync('./cert/certificate.pem')
};

https.createServer(options, app).listen(app.get('port'), function(){
  console.log('NewTeck server listening on port ' + app.get('port'));
});
*/

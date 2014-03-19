/**
*    MongoDB 服务器接口
*/
//var util = require('util');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var AppConfig = require('../app-config.json');    // AppConfig
var databaseConfig = AppConfig.bae ? AppConfig.database_bae : AppConfig.database_local;

// 数据库配置信息
var db_name = databaseConfig.db_name;   // 数据库名，从云平台获取 ， OMgCwmHmaMNclxEqvFbK (doc4doc), MSkCkkXtzwmoBJhYzyyL (newteck), eSZsNQyCsqPCKVmFOOER (qingci)
var db_host =  databaseConfig.db_host;      // 数据库地址
var db_port =  +databaseConfig.db_port;   // 数据库端口
var username = databaseConfig.username;    // 用户名
var password = databaseConfig.password;    // 密码
 
var db = new Db(
    db_name,    // 数据库的名字
    new Server(db_host, db_port,    // 数据库服务器 ip 和 端口
        {poolSize: 10, auto_reconnect: true}    // 数据库服务器设置， 连接池和自动连接
    ),
    {w: 1});    // 数据库选项， w >= 1 保证“写入”

// 连接数据库 
Db.prototype.connect = function(){
    console.log('start connect mongodb ...');
    this.open(function(){    // db.open
        console.log('authenticate start ...');
        db.authenticate(username, password, function(error, result) {    // 认证数据库连接, result 和 db 会是同一个对象
            if(error || !result) {
                console.log('authenticate failed and error : ' + error);
            }else{
                console.log('have connected mongodb and finished authenticating ...');
            }
        });
    });
};

exports.db = db;    // 导出 db
db.connect();    // 连接数据库
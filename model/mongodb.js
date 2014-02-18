/**
*    MongoDB 服务器接口
*/
//var util = require('util');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

// 数据库配置信息
// var db_name = 'MSkCkkXtzwmoBJhYzyyL';                 // 数据库名，从云平台获取 ， newteck 的数据库
// var db_name = 'eSZsNQyCsqPCKVmFOOER';                  // 数据库名，从云平台获取 , qingci 数据库
// var db_host =  process.env.BAE_ENV_ADDR_MONGO_IP;      // 数据库地址
// var db_port =  +process.env.BAE_ENV_ADDR_MONGO_PORT;   // 数据库端口
// var username = process.env.BAE_ENV_AK;                 // 用户名
// var password = process.env.BAE_ENV_SK;                 // 密码
var db_name = 'node';
var db_host =  '127.0.0.1';
var db_port =  27017;
var username = 'ant';
var password = 'ant';
 
var db = new Db(
    db_name,    // 数据库的名字
    new Server(db_host, db_port,    // 数据库服务器 ip 和 端口
        {poolSize: 10, auto_reconnect: true}    // 数据库服务器设置， 连接池和自动连接
    ),
    {w: 1});    // 数据库选项， w >= 1 保证“写入”
exports.db = db;

// 数据库连接状态
// Db.prototype.is_connected = false;

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
                // db.is_connected = true;
            }
        });
    });
};

db.connect();
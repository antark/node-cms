/**
*    User interface
*/
// var util = require('util');
var db = require('./mongodb').db;    // 数据库对象 db
var cry = require('./cryption');    // 加密算法

function User(){
    // mail : 邮箱
    // password : 密码(密文)
    // name : 昵称
    // reg_time : 注册时间
    // education ['above_master', 'university', 'high_school', 'middle_school', 'primary_school'] : 教育信息 [本科以上, 大学, 高中, 初中, 小学]
    // story ['self_intro', 'tag', 'motto'] : 个人介绍信息 [自我介绍, 标签, 座右铭]
    // contact ['homepage', 'weibo', 'other'] : 联系信息 [主页, 微博, 其他]
}

exports.User = User;

// User.insert
User.prototype.insert = function(users, callback){
    var msg = {};
    db.collection('users').insert(users, function(error, objects){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// User.find
User.prototype.find = function(condition, callback){
    var msg = {};
    db.collection('users').find(condition).toArray(function(error, objects){    // find 多个
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error
        msg.objects = objects;
        callback(msg);
    });
};

// User.findOne
User.prototype.findOne = function(condition, callback){
    var msg = {};
    db.collection('users').findOne(condition, function(error, object){    // 只 find 一个
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error
        msg.object = object;
        callback(msg);
    });
};

// User.findOnePage
User.prototype.findOnePage = function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    db.collection('users').find(condition).skip(nskip).limit(n).toArray(function(error, objects){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// User.update
User.prototype.update = function(condition, setter, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    db.collection('users').update(condition, setter, {'multi': multi}, function(error, count){    // 默认只更新一个对象
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.number = count;
        callback(msg);
    });
};

// User.remove ： 根据条件删 post
User.prototype.remove = function(condition, callback){
    var msg = {};
    db.collection('users').remove(condition, function(error, collection){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        callback(msg);
    });
};
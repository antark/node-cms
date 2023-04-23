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
User.prototype.insert = async function(user, callback){
    var msg = {};
    msg.objects = await db.collection('users').insertOne(user);
    console.log(JSON.stringify(msg.objects));
    callback(msg);
};

// User.find
User.prototype.find = async function(condition, callback){
    var msg = {};
    msg.objects = await db.collection('users').find(condition).toArray();
    callback(msg);
};

// User.findOne
User.prototype.findOne = async function(condition, callback){
    var msg = {};
    msg.object = await db.collection('users').findOne(condition);
    callback(msg);
};

// User.findOnePage
User.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('users').find(condition).skip(nskip).limit(n).toArray();
    callback(msg);
};

// User.update
User.prototype.update = async function(condition, setter, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    msg.number = await db.collection('users').updateOne(condition, setter, {'multi': multi});
    callback(msg);
};

// User.remove ： 根据条件删 post
User.prototype.remove = async function(condition, callback){
    var msg = {};
    await db.collection('users').remove(condition);
    callback(msg);
};

/**
*    Doc 文件操作接口
*/
// var util = require('util');
var fs = require('fs');
var db = require('./mongodb').db;

function Tag(){
    // name : 项目名称
    
}

exports.Tag = Tag;

// Tag.insert ： 插入 tag
Tag.prototype.insert = async function(tags, callback){    //
    var msg = {};
    msg.objects = await db.collection('tags').insert(tags);
    callback(msg);
};

// Tag.findOne ： 查找一个
Tag.prototype.findOne = async function(condition, callback){
    var msg = {};
    msg.object = await db.collection('tags').findOne(condition);
    callback(msg);
};

// Tag.findOnePage ： 查找一页
Tag.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 40;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('tags').find(condition).skip(nskip).limit(n).toArray();
    callback(msg);
};

// Tag.update ： 更新 tag
Tag.prototype.update = async function(condition, setter, callback){    //
    var msg = {};
    msg.objects = db.collection('tags').update(condition, setter, {upsert: true});
    callback(msg);
};
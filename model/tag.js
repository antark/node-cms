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
Tag.prototype.insert = function(tags, callback){    //
    var msg = {};
    db.collection('tags').insert(tags, function(error, objects){
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Tag.findOne ： 查找一个
Tag.prototype.findOne = function(condition, callback){
    var msg = {};
    db.collection('tags').findOne(condition, function(error, object){    // 
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.object = object;
        callback(msg);
    });
};

// Tag.findOnePage ： 查找一页
Tag.prototype.findOnePage = function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 40;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    db.collection('tags').find(condition).skip(nskip).limit(n).toArray(function(error, objects){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Tag.update ： 更新 tag
Tag.prototype.update = function(condition, setter, callback){    //
    var msg = {};
    db.collection('tags').update(condition, setter, {upsert: true}, function(error, objects){    //  找不到则 insert
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};
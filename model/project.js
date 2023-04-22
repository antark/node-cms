/**
*    Doc 文件操作接口
*/
// var util = require('util');
var fs = require('fs');
var db = require('./mongodb').db;

function Project(){
    // name : 项目名称
    
}

exports.Project = Project;

// Project.insert ： 插入 project
Project.prototype.insert = function(projects, callback){    //
    var msg = {};
    db.collection('projects').insert(projects, function(error, objects){
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Project.findOne ： 查找一个
Project.prototype.findOne = function(condition, callback){
    var msg = {};
    db.collection('projects').findOne(condition, function(error, object){    // 
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.object = object;
        callback(msg);
    });
};

// Project.findOnePage ： 查找一页
Project.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    

    var list = await db.collection('projects').find().skip(nskip).limit(n).toArray(function(error, objects){
        console.log("projects result:"+JSON.stringify(objects));
	if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });

	msg.objects = list;
	callback(msg);
};

// Project.update ： 更新 project
Project.prototype.update = function(condition, setter, callback){    //
    var msg = {};
    db.collection('projects').update(condition, setter, {upsert: true}, function(error, objects){    //  找不到则 insert
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

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
Project.prototype.insert = async function(projects, callback){    //
    var msg = {};
    msg.objects = await db.collection('projects').insert(projects);
    callback(msg);
};

// Project.findOne ： 查找一个
Project.prototype.findOne = async function(condition, callback){
    var msg = {};
    msg.object = await db.collection('projects').findOne(condition);
    callback(msg);
};

// Project.findOnePage ： 查找一页
Project.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('projects').find().skip(nskip).limit(n).toArray();
	callback(msg);
};

// Project.update ： 更新 project
Project.prototype.update = async function(condition, setter, callback){    //
    var msg = {};
    msg.objects = await db.collection('projects').updateOne(condition, setter, {upsert: true});
    callback(msg);
};

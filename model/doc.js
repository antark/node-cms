/**
*    Doc 文件操作接口
*/
// var util = require('util');
var fs = require('fs');
var db = require('./mongodb').db;

function Doc(){
    // name : 文档名称
    // type : 类型
    // size : 大小
    // upload_time : 上传时间
}

exports.Doc = Doc;

// Doc.insert ： 插入多张 doc
Doc.prototype.insert = async function(docs, callback){    //
    var msg = {};
    msg.objects = await db.collection('docs').insert(docs);
    callback(msg);
};

// Doc.find ： 查找图片
Doc.prototype.find = async function(condition, callback){
    var msg = {};
    msg.objects = await db.collection('docs').find(condition).sort({upload_time: -1}).toArray();
    callback(msg);
};

// Doc.findOnePage
Doc.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('docs').find(condition).sort({upload_time: -1}).skip(nskip).limit(n).toArray();
    callback(msg);
};
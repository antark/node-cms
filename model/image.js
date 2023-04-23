/**
*    Image 文件操作接口
*/
// var util = require('util');
var fs = require('fs');
var db = require('./mongodb').db;

function Image(){
    // name : 文档名称
    // type : 类型
    // size : 大小
    // upload_time : 上传时间
}

exports.Image = Image;

// User.inserts ： 插入多张图片
Image.prototype.insert = async function(images, callback){    // 保存一个图片
    var msg = {};
    msg.objects = await db.collection('images').insert(images);
    console.log(JSON.stringify(msg));
    callback(msg);
};

// Image.find ： 查找图片
Image.prototype.find = async function(condition, callback){
    var msg = {};
    msg.objects = await db.collection('images').find(condition).sort({upload_time: -1}).toArray();
    callback(msg);
};

// Image.findOnePage
Image.prototype.findOnePage = async function(condition, callback){
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    var user_id = condition.user_id;

    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    var msg = {};
    msg.objects = await db.collection('images').find(condition).sort({upload_time: -1}).skip(nskip).limit(n).toArray();
    callback(msg);
};

// Image.update ： 更新图片信息
Image.prototype.update = async function(condition, set, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    msg.number = db.collection('images').updateOne(condition, set, {'multi': multi});
    callback(msg);
};

// Image.remove ： 根据条件删除图片
Image.prototype.remove = async function(condition, callback){
    var msg = {};
    var image = {};
    var objects = await db.collection('images').find(condition).toArray();
    image = objects[0];
    
    await db.collection('images').removeOne(condition);

    var path = __dirname + '/../public/uploads/image/' + image.name;
    fs.unlink(path, function(error){
        msg.error = error;
        callback(msg);
    });
};
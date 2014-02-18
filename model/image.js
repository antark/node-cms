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
Image.prototype.insert = function(images, callback){    // 保存一个图片
    var msg = {};
    db.collection('images').insert(images, function(error, objects){
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Image.find ： 查找图片
Image.prototype.find = function(condition, callback){
    var msg = {};
    db.collection('images').find(condition).sort({upload_time: -1}).toArray(function(error, objects){    // 根据用户名 find users
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Image.findOnePage
Image.prototype.findOnePage = function(condition, callback){
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    var user_id = condition.user_id;

    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    var msg = {};
    db.collection('images').find(condition).sort({upload_time: -1}).skip(nskip).limit(n).toArray(function(error, objects){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        callback(msg);
    });
};

// Image.update ： 更新图片信息
Image.prototype.update = function(condition, set, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    db.collection('images').update(condition, set, {'multi': multi}, function(error, count){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.number = count;
        callback(msg);
    });
};

// Image.remove ： 根据条件删除图片
Image.prototype.remove = function(condition, callback){
    var msg = {};
    var image = {};
    db.collection('images').find(condition).toArray(function(error, objects){    // 查询图片信息
        if(error || objects.length < 1){
            console.log('error : ' + error);
            msg.error = error;
            callback(msg);
            return;
        }
        image = objects[0];
        db.collection('images').remove(condition, function(error, collection){    // 数据库中删除图片
            if(error){
                console.log('error : ' + error);
                msg.error = error;
                callback(msg);
                return;
            }
            
            var path = __dirname + '/../public/uploads/image/' + image.name;
            fs.unlink(path, function(error){
                msg.error = error;
                callback(msg);
            });
        });
    });
};
/**
*    Post interface
*/
// var util = require('util');
var db = require('./mongodb').db;

function Post(){    // ID 、 标题 、 内容、 用户ID 、 时间 、 标签
    // _id : ID
    // title : 标题
    // content : 内容
    // user_id : 用户 ID 
    // user_name : 用户名
    // time : 发表时间
    // tags : 标签 (数组)
}

exports.Post = Post;

// Post.save ： 保存一个 doc ， 可以是 insert 或是 update 
Post.prototype.save = function(post, callback){
    var msg = {};
    db.collection('posts').save(post, function(error, result){  // insert return object, update return number !
        if(error){
            console.log('error: ' + error);
        }
        msg.error = error;
        if(typeof result == 'number'){  // return previous object
            msg.object = post;
        }else{  // return inserted object
            msg.object = result;
        }
        callback(msg);
    });
};

// Post.count ： 搜索 post 的总数目
Post.prototype.count = function(callback){
    var msg = {};
    db.collection('posts').count(function(error, count){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.number = count;
        callback(msg);
    });
};

// Post.find
Post.prototype.find = function(condition, callback){
    var msg = {};
    db.collection('posts').find(condition).toArray(function(error, objects){    // find 多个
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error
        msg.objects = objects;
        callback(msg);
    });
};
// Post.findOne
Post.prototype.findOne = function(condition, callback){
    var msg = {};
    db.collection('posts').findOne(condition, {comments: {$slice: -5}}, function(error, object){    // find 多个
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error
        msg.object = object;
        callback(msg);
    });
};
// Post.findOnePage ： 通过条件查 post
Post.prototype.findOnePage = function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    db.collection('posts').find(condition, {content: 0, comments: 0}).sort({time: -1}).skip(nskip).limit(n).toArray(function(error, objects){    // 
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.objects = objects;
        console.log(JSON.stringify(objects));
        callback(msg);
    });
};

// Post.update ： 更新 post
Post.prototype.update = function(condition, set, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    db.collection('posts').update(condition, set, {'multi': multi}, function(error, count){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        msg.number = count;
        callback(msg);
    });
};

// Post.remove ： 根据条件删 post
Post.prototype.remove = function(condition, callback){
    var msg = {};
    db.collection('posts').remove(condition, function(error, collection){
        if(error){
            console.log('error : ' + error);
        }
        msg.error = error;
        callback(msg);
    });
};
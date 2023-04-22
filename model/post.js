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
Post.prototype.save = async function(post, callback){
    var msg = {};
    if(!post._id) {
        msg.object = await db.collection('posts').insertOne(post);
    }else{
        msg.object = await db.collection('posts').updateOne(post);
    }

    callback(msg);
};

// Post.count ： 搜索 post 的总数目
Post.prototype.count = async function(callback){
    var msg = {};
    msg.number = await db.collection('posts').count();
    callback(msg);
};

// Post.find
Post.prototype.find = async function(condition, callback){
    var msg = {};
    msg.objects = await db.collection('posts').find(condition).toArray();
    callback(msg);
};
// Post.findOne
Post.prototype.findOne = async function(condition, callback){
    var msg = {};
    msg.object = await db.collection('posts').findOne(condition, {comments: {$slice: -5}});
    callback(msg);
};

// Post.findOnePage ： 通过条件查 post
Post.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('posts').find(condition, {content: 0, comments: 0}).sort({time: -1}).skip(nskip).limit(n).toArray();
    callback(msg);
};

// Post.update ： 更新 post
Post.prototype.update = async function(condition, set, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    msg.number = await db.collection('posts').update(condition, set, {'multi': multi});
    callback(msg);
};

// Post.remove ： 根据条件删 post
Post.prototype.remove = async function(condition, callback){
    var msg = {};
    await db.collection('posts').remove(condition);
    callback(msg);
};
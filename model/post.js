/**
*    Post interface
*/
// var util = require('util');
var db = require('./mongodb').db;
var ObjectID = require('mongodb').ObjectId;

function Post(){    // ID �� ���� �� ���ݡ� �û�ID �� ʱ�� �� ��ǩ
    // _id : ID
    // title : ����
    // content : ����
    // user_id : �û� ID 
    // user_name : �û���
    // time : ����ʱ��
    // tags : ��ǩ (����)
}

exports.Post = Post;

// Post.save �� ����һ�� doc �� ������ insert ���� update 
Post.prototype.save = async function(post, callback){
    var msg = {};
    if(!post._id) {
        let object = await db.collection('posts').insertOne(post);
        post._id = object.insertedId;
	msg.object = post;
    }else{
        await db.collection('posts').findOneAndReplace({"_id": new ObjectID(post._id)}, post);
	msg.object = post;
    }
    console.log(JSON.stringify(msg));
    callback(msg);
};

// Post.count �� ���� post ������Ŀ
Post.prototype.count = async function(callback){
    var msg = {};
    msg.number = await db.collection('posts').count();
    console.log(JSON.stringify(msg));
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
    console.log(JSON.stringify(msg));
    callback(msg);
};

// Post.findOnePage �� ͨ�������� post
Post.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('posts').find(condition, {content: 0, comments: 0}).sort({time: -1}).skip(nskip).limit(n).toArray();
    console.log(JSON.stringify(msg));
    callback(msg);
};

// Post.update
Post.prototype.update = async function(condition, set, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    msg.number = await db.collection('posts').updateOne(condition, set, {'multi': multi});
    console.log(JSON.stringify(msg));
    callback(msg);
};

// Post.remove
Post.prototype.remove = async function(condition, callback){
    var msg = {};
    await db.collection('posts').deleteOne(condition);
    console.log(JSON.stringify(msg));
    callback(msg);
};

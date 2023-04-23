/**
*    User interface
*/
// var util = require('util');
var db = require('./mongodb').db;    // ���ݿ���� db
var cry = require('./cryption');    // �����㷨

function User(){
    // mail : ����
    // password : ����(����)
    // name : �ǳ�
    // reg_time : ע��ʱ��
    // education ['above_master', 'university', 'high_school', 'middle_school', 'primary_school'] : ������Ϣ [��������, ��ѧ, ����, ����, Сѧ]
    // story ['self_intro', 'tag', 'motto'] : ���˽�����Ϣ [���ҽ���, ��ǩ, ������]
    // contact ['homepage', 'weibo', 'other'] : ��ϵ��Ϣ [��ҳ, ΢��, ����]
}

exports.User = User;

// User.insert
User.prototype.insert = async function(user, callback){
    var msg = {};
    msg.objects = await db.collection('users').insertOne(user);
    console.log(JSON.stringify(msg.objects));
    callback(msg);
};

// User.find
User.prototype.find = async function(condition, callback){
    var msg = {};
    msg.objects = await db.collection('users').find(condition).toArray();
    callback(msg);
};

// User.findOne
User.prototype.findOne = async function(condition, callback){
    var msg = {};
    msg.object = await db.collection('users').findOne(condition);
    callback(msg);
};

// User.findOnePage
User.prototype.findOnePage = async function(condition, callback){
    var msg = {};
    var nskip = +condition.nskip || 0, n = +condition.n || 15;
    
    if(typeof condition.nskip != 'undefined') delete condition.nskip;
    if(typeof condition.n != 'undefined') delete condition.n;
    
    msg.objects = await db.collection('users').find(condition).skip(nskip).limit(n).toArray();
    callback(msg);
};

// User.update
User.prototype.update = async function(condition, setter, callback){
    var msg = {};
    var multi = condition.multi || false;
    if(condition.multi) delete condition.multi;
    
    msg.number = await db.collection('users').updateOne(condition, setter, {'multi': multi});
    callback(msg);
};

// User.remove �� ��������ɾ post
User.prototype.remove = async function(condition, callback){
    var msg = {};
    await db.collection('users').remove(condition);
    callback(msg);
};

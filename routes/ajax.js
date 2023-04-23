/* 
* ajax router
*/

// var util = require('util');
var formidable = require('formidable');
var fs = require('fs');

var ObjectID = require('mongodb').ObjectId;
var User = require('../model/user').User;
var Post = require('../model/post').Post;
var Image = require('../model/image').Image;
var cry = require('../model/cryption');
var Project = require('../model/project').Project;
var Tag = require('../model/tag').Tag;

exports.map = function(app){
    // 获取一个 n 范围内的随机数 (0 - n， 包括 0 和 n)
    app.get('/utility/get-one-random', function (req, res){
        var n = new Number(req.param('number'));
        var m = new Number(Math.random()*n).toFixed(0);
        var ret = {};
        ret.number = m;
        res.send(ret);
    });
    
    // 
    app.get('/get-one-page-of-images', function(req, res){
        var ret = {};
        if(!req.query.user_id || req.query.user_id.trim() == ""){
            ret.error = {info: '参数不全'};
            res.send(ret);
            return;
        }
        var ret = {};
        var user_id = req.query.user_id;
        var nskip = +req.query.nskip || 0, n = +req.query.n || 20;
        
        var imageModel = new Image();
        
        var condition = {'user_id': user_id.toString(), 'nskip': nskip, 'n' : n};
        imageModel.findOnePage(condition, function(msg){    // 获取 admin 的相册
            ret = msg;
            res.send(ret);
        });
    });
    
    
    // 获取图片欣赏的数据 (右侧的图片)
    app.get('/img-xinshang', function(req, res){
        var ret = {};
        var nskip = +req.query.nskip || 0;
        var n = +req.query.n || 8;
        
        var admin = null;
        var userModel = new User();
        var imageModel = new Image();
        userModel.findOne({'name': 'admin'}, function(msg){    // 获取管理员 admin 的 ID
            if(msg.error || !msg.object){
                ret.error = msg.error || {'info': 'admin 账号不存在!'};
                res.send(ret);
            }else{
                admin = msg.object;
                var condition = {'user_id': admin._id.toString(), 'nskip': nskip, 'n' : n};
                imageModel.findOnePage(condition, function(msg){    // 获取 admin 的相册
                    ret = msg;
                    res.send(ret);
                });
            }
        });
    });
    
    // user-reg ： 用户注册 (邮箱不能重复注册 、 用户名不能重复 、 有唯一的 admin 账户)
    app.post('/user-reg', function (req, res){
        var ret = {};    // 返回值
        var userModel = new User();
        var user = {'mail': req.body.mail, 'password': req.body.password, 'name': req.body.name, 'reg_time': new Date()};
        
        userModel.findOne({$or: [{'mail' : user.mail }, {'name' : user.name }]}, function(msg){    // 搜索邮箱 mail 和用户名 name 是否已经存在
            if(msg.error){
                ret.error = {type: 'server', info : '数据库查询出错 ! '};
                res.send(ret);
            }else if(msg.object){    // 邮箱或是用户名已经注册过
                if(msg.object.mail == user.mail){
                    ret.error = {type: 'mail', info : '邮箱已经被注册过 ! '};
                }else{
                    ret.error = {type: 'name', info : '用户名已经存在 ! '};
                }
                res.send(ret);
            }else{    // 插入一条记录
                user.password = cry.encrypt(user.password);    // 对密码进行加密
                userModel.insert(user, function(msg){    // 插入记录
                    if(msg.error){
                        ret.error = {type: 'server', info : '数据库插入出错 ! '};
                    }else{
                        ret.object = msg.objects[0];
                        req.session.user = msg.objects[0];    // 更新 session[''user]
                    }
                    res.send(ret);
                });
            }
        });
    });
    
    // verify-login ： 验证用户登录
    app.post('/verify-login', function (req, res){
        var userModel= new User();
        var user = {'mail': req.body.mail, 'password': req.body.password};
        
        userModel.findOne({'mail': user.mail}, function(msg){    // 根据邮箱搜索用户
            var ret = {};
            
            if(msg.error){    // 查询出错
                ret.error = {type : 'server', info : '数据库查询出错 !'};
            }else if(!msg.object){    // 没有搜索到用户
                ret.error = {type : 'mail', info : '该邮箱没有对应的用户 !'};
            }else if(msg.object.password != cry.encrypt(user.password)){    // 密码出错
                ret.error = {type : 'password', info : '输入密码有误 !'};
            }else{    // 登陆成功
                ret.object = msg.object;
                req.session.user = msg.object;    // 更新 session[''user]
            }
            res.send(ret);
        });
    });
    
    // post 写入数据库
    app.post('/post-save', function (req, res){
        var pro_names = ['nodejs', 'golang', 'python', 'c', 'c++', 'c-sharp', 'objective-c', 'java'];
        var ret = {};    // 返回对象
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        if(!req.body.post.title || !req.body.post.project || !req.body.post.tags){
            ret.error = {info: '参数不全'};
            res.send(ret);
            return;
        }
        for(var ii = 0; ii < pro_names.length; ++ii)
            if(pro_names[ii] == req.body.post.project)
                break;
        if(ii >= pro_names.length){
            ret.error = {info: 'u 选择的项目暂不支持!'};
            res.send(ret);
            return;
        }
        if(req.body.post.content.match(/(<script>)|(<\/script>)/)){
            ret.error = {info: '内容中包含脚本代码'};
            res.send(ret);
            return;
        }
        
        var post = {_id: req.body.post._id || null, title: req.body.post.title, summary: req.body.post.summary, content: req.body.post.content, 
                user_id: req.body.post.user_id, user_name: req.body.post.user_name,
                time: new Date(), project: req.body.post.project, tags: req.body.post.tags
            };
        var postModel = new Post();
        
        if(post._id){    // post 有 ID， 转换一下
            post._id = new ObjectID(post._id);
        }
        if(!post.user_id){    // post 没有 user ID， 更新为 session user
            post.user_id = req.session.user._id;
            post.user_name = req.session.user.name;
        }
        
        postModel.save(post, function(msg){    // insert 或是 update 数据库
            if(msg.error){
                ret.error = {info: '写入数据库失败'};
            }else{    // post 成功 save
                ret.object = msg.object;
                
                var projectModel = new Project();
                projectModel.update({name: msg.object.project}, {$set: {name: msg.object.project}}, function(msg){    // 更新项目集
                    if(msg.error){
                        console.log('error: '+ msg.error);
                    }
                });
                var tagModel = new Tag();
                msg.object.tags.forEach(function(tag){    // 更新标签集
                    tagModel.update({name: tag}, {$set: {name: tag}}, function(msg){    // 更新项目集
                        if(msg.error){
                            console.log('error: '+ msg.error);
                        }
                    });
                });
            }
            res.send(ret);
        });
    });
    
    // 删除 post
    app.post('/post-delete', function (req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        var post_id = req.body.post_id;
        var postModel = new Post();
        postModel.findOne({"_id": new ObjectID(post_id)}, function(msg){    // 搜索一下
            if(msg.error || !msg.object){    // 查询出错
                ret.error = {info: '查询出错 !'};
                res.send(ret);
                return;
            }else if(req.session.user.name != 'admin' && msg.object.user_id != req.session.user._id.toString()){    // post 非登陆用户缩写， 不具有权限； admin 账户除外
                ret.error = {info: '不是你写的 !'};
                res.send(ret);
                return;
            }else{    // 
                postModel.remove({"_id": new ObjectID(post_id)}, function(msg){    // 删除
                    ret.error = msg.error;
                    res.send(ret);
                });
            }
        });
        
    });
    
    // 修改个人的基本信息
    app.post('/profile-update', function (req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        console.log(JSON.stringify(req.body)); 
        var userModel = new User();
        var user = {};
        user._id = req.body.user.id ? req.body.user.id : req.session.user._id;    // 获取 ID
        var setter = {$set:{}};
        var cat = req.body.cat;
        if(cat != 'basic' && cat != 'privacy' && cat != 'education' && cat != 'story' && cat != 'contact'){
            ret.error = {info:'分类错误'};
            res.send(ret);
            return;
        }
        var info_privacy = ['sex', 'birthday', 'age', 'marriage'];
        var info_edu = ['above_master', 'university', 'high_school', 'middle_school', 'primary_school'];
        var info_story = ['self_intro', 'tag', 'motto'];
        var info_contact = ['homepage', 'weibo', 'other'];

        if(cat == "basic"){    // 注册信息(基本信息)
            user.name = req.body.user.name;
            setter.$set.name = user.name;
        }else if(cat == 'privacy'){    // 隐私信息
            setter.$set.privacy = {};
            for(p in info_privacy)
                setter.$set.privacy[info_privacy[p]] = req.body.user.privacy[info_privacy[p]];
        }else if(cat == 'education'){    // 教育信息
            setter.$set.education = {};
            for(p in info_edu)
                setter.$set.education[info_edu[p]] = req.body.user.education[info_edu[p]];
        }else if(cat == 'story'){    // story
            setter.$set.story = {};
            for(p in info_story)
                setter.$set.story[info_story[p]] = req.body.user.story[info_story[p]];
        }else if(cat == 'contact'){    // 联系信息
            setter.$set.contact = {};
            for(p in info_contact)
                setter.$set.contact[info_contact[p]] = req.body.user.contact[info_contact[p]];
        }
        
        if(cat == "basic"){    // 用户名修改之前需要检查
            if(user.name == req.session.user.name){
                    ret.error = {'info': '用户名不用修改'};
                    res.send(ret);
                    return;
            }
            userModel.findOne({'name' : user.name}, function(msg){    // 根据 name 搜索
                if(msg.error){
                    ret.error = msg.error;
                    res.send(ret);
                }else if(msg.object){    // 
                    ret.error = {'info': '用户名已经存在'};
                    res.send(ret);
                }else{
                    profile_update(req, res, user, setter);
                }
            });
        }else{    // 直接修改信息
             profile_update(req, res, user, setter);
        }

        function profile_update(){    // 更新 profile 函数
            userModel.update({"_id": new ObjectID(user._id)}, setter, function(msg){
                var ret = {};
                if(msg.error){    // 
                    ret.error = {info : '数据库出错 ! '};
                }else{
                    if(cat == 'basic')    // 更新 session
                        req.session.user.name = user.name;
                    else{
                        req.session.user[cat] = setter.$set[cat];
                    }
                }
                res.send(ret);
            });
        }
  
    });
    
        //  删除图片
    app.post('/img-delete', function (req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        if(!req.body.id){
            ret.error = {info: '参数不全'};
            res.send(ret);
            return;
        }
        var id = req.body.id;
        
        var image_model = new Image();
        image_model.find({"_id": new ObjectID(id)}, function(msg){   // 搜索对应的 image
            if(msg.error || !msg.objects || msg.objects.length < 1){    // 查询出错
                ret.error = {'info': '查询出错!'};
                res.send(ret);
            }else if(req.session.user.name != 'admin' && msg.objects[0].user_id != req.session.user._id.toString()){   // image 非该用户所有， 管理员账号除外
                ret.error = {'info': '不是你的图片， 你不可以删除!'};
                res.send(ret);
            }else{   // 可以修改 image
                image_model.remove({"_id": new ObjectID(id)}, function(msg){
                    ret.error = msg.error;
                    res.send(ret);
                });
            }
        });
    });
    
    // 修改图片的介绍信息
    app.post('/img-info-update', function (req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        if(!req.body.id || !req.body.info){
            ret.error = {info: '参数不全'};
            res.send(ret);
            return;
        }
        var id = req.body.id;
        var info = req.body.info;
        
        var image_model = new Image();
        image_model.find({"_id": new ObjectID(id)}, function(msg){   // 搜索对应的 image
            if(msg.error || !msg.objects || msg.objects.length < 1){    // 查询出错
                ret.error = {'info': '查询出错!'};
                res.send(ret);
            }else if(req.session.user.name != 'admin' && msg.objects[0].user_id != req.session.user._id.toString()){   // post 非该用户所写， 管理员账号除外
                ret.error = {'info': '不是你的图片， 你不可以修改!'};
                res.send(ret);
            }else{   // 可以修改 image
                var setter = {$set:{'info': info}};
                image_model.update({"_id": new ObjectID(id)}, setter, function(msg){
                    ret.error = msg.error;
                    res.send(ret);
                });
            }
        });

    });
    
    // 添加注释
    app.post('/add/comments', function (req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        if(!req.body.post_id || !req.body.comments){
            ret.error = {info: '参数不全'};
            res.send(ret);
            return;
        }
        var post_id = req.body.post_id;
        var comments = req.body.comments;
        var postModel = new Post();
        postModel.update({_id: new ObjectID(post_id)}, {$push:{comments: {user_id: req.session.user._id, user_name: req.session.user.name, text: comments}}}, function(msg){
            res.send(ret);
        });
    });
}

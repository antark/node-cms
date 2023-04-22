/* 
* page router :
*
*    /    ==>    index
*    /error-404   ==>    error-4xx
*    /+<uname>    ==>    /+<uname>/posts
*    /+<uname>/profile    ==>    profile
*    /+<uname>/posts    ==>    posts
*    /users/+<uname>/<cat>    ==>    /+<uname>/<cat>
*    ...
*
*/

// var util = require('util');
var formidable = require('formidable');
var fs = require('fs');

var ObjectID = require('mongodb').ObjectID;
var User = require('../model/user').User;    // UserDAO
var Post = require('../model/post').Post;    // PostDAO
var Image = require('../model/image').Image;    // ImageDAO
var Doc = require('../model/doc').Doc;    // DocDAO
var Project = require('../model/project').Project;    // ProjectDAO
var Tag = require('../model/tag').Tag;    // TagDAO

exports.map = function(app){
    var admin = null;    // 管理员账号
    
    // 主页
    app.get('/', function (req, res){
        res.render('index', { title: '主页- Doc4Doc - 文档的文档', user: req.session.user, ntabs: true});    //
    });
    
    // 错误页面
    app.get('/error-404', function (req, res){
        res.render('error-4xx', { title: 'error 404 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    
    // 用户信息页
    app.get(/^\/\+([^\/]+)\/(.+)?$/, function (req, res){    // url : /+ants/profile, /+ants/posts
        var name = req.params[0];    // user name : ants
        var cat = req.params[1] ? req.params[1] : 'profile';    // default --> profile
        
        var userModel = new User();
        var user = {};
        userModel.findOne({'name': name}, function(msg){
            if(msg.error || !msg.object){
                res.redirect('/login');    // 重定向到登陆页面
                return;
            }
            user = msg.object;    // 获取用户
            
            switch(cat){
            case 'profile' :    // 个人信息页
                res.render('profile', {'title': '个人信息' , 'user': req.session.user, 'other': user});    // session user 和 other user ， user 是登录用户， other 是被查看用户
                break;
            case 'posts' :    // 个人 posts 页
                var postModel = new Post();
                postModel.findOnePage({'user_id': user._id.toString()}, function(msg){
                    res.render('post', { title: name+'写的短文', 'user': req.session.user, posts: msg.objects, 'other': user});
                });
                break;

            case 'gallery' :    // 个人相册页
                var imageModel = new Image();
                imageModel.findOnePage({'user_id': user._id.toString()}, function(msg){
                    res.render('gallery', { title: name+'的相册', 'user': req.session.user, gallery: msg.objects, 'other': user});
                });
                break;
            case 'file' :    // 个人文件页
                var docModel = new Doc();
                docModel.findOnePage({'user_id': user._id.toString()}, function(msg){
                    res.render('file', { title: name+'的文件', 'user': req.session.user, files: msg.objects, 'other': user});
                });
                break;
            default:
                res.redirect('/login');    // 重定向到登陆
                break;
            }
        });
    });
    
    // 用户信息页 (更为一般)
    app.get(/^\/\+([^\/]+)$/, function (req, res){    // url :  /+ants  ==> /+ants/profile    ( 中文 : \u4E00-\u9FA5)
        var user = req.params[0];
        res.redirect('/+' + user + '/profile');
    });
    
    // 用户信息页
    app.get('/users/:user/:cat', function (req, res){
        var name = req.params.user;    //
        var cat = req.params.cat;    //
        if(cat != 'profile' || cat != 'posts' || cat != 'gallery' || cat != 'file'){
            res.redirect('/login');    // 重定向到登陆
        }else{
            res.redirect('/+' + name + '/' + cat);
        }
    });
    app.get('/users/:user', function (req, res){    // url : /users/ant ==> users/+ant/profile
        var name = req.params.user;
        res.redirect('/+' + name + '/profile');
    });
    
    // 个人信息页面
    app.get('/profile', function (req, res){
        if(!req.session.user){
            res.redirect('/login');    // 302 到登陆页面
        }else{
            res.render('profile', {'title': '用户信息页 - 个人信息' , 'user': req.session.user, 'other': req.session.user});    // user 是登录用户， other 是被查看用户
        }
    });
    
    // 所有项目页面
    app.get('/projects', function (req, res){
	console.log("access projects");
	var projectModel = new Project();
        projectModel.findOnePage({}, function(msg){
            res.render('projects', { title: '所有项目 - Doc4Doc - 文档的文档', user: req.session.user, projects: msg.objects, ntabs: true});
        });
    });
    
    // 所有标签页面
    app.get('/tags', function (req, res){
        var tagModel = new Tag();
        tagModel.findOnePage({}, function(msg){
            res.render('tags', { title: '所有标签 - Doc4Doc - 文档的文档', user: req.session.user, tags: msg.objects, ntabs: true});
        });
    });
    
    // 项目页
    app.get('/projects/:project', function (req, res){    //
        var project = req.params.project;    // 获取标签
        var postModel = new Post();
        postModel.findOnePage({'project': project}, function(msg){
            res.render('post-list', { title: project+ ' - Doc4Doc - 文档的文档', user: req.session.user, posts: msg.objects, ntabs: true, 'project': project});
        });
    });
    
    // 标签页
    app.get('/tags/:tag', function (req, res){    //
        var tag = req.params.tag;    // 获取标签
        var postModel = new Post();
        postModel.findOnePage({tags: {$all: [tag]}}, function(msg){
            res.render('post-list', { title: tag+ ' - Doc4Doc - 文档的文档', user: req.session.user, posts: msg.objects, ntabs: true, 'tag': tag});
        });
    });
    
    
    // 搜索页面
    app.get('/search', function (req, res){
        res.render('search', { title: '搜索页面- Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    // 成员页面
    app.get('/member', function (req, res){
        var userModel = new User();
        var postModel = new Post();
        var msg = {};
        
        postModel.count(function(msg){    // 获取文章数目
            if(msg.error){
                res.render('member', {'title': '功勋元老 - Doc4Doc - 文档的文档' , 'user': req.session.user});
                return;
            }
            var n_posts = msg.number;
            
            var page_count = 8;    // 默认一页显示 8 个用户
            var page = parseInt(req.query.page);
            if(isNaN(page) || page < 1)
                page = 1;
            var nskip =page_count*(page-1);
            
            userModel.findOnePage({'nskip': nskip, 'n': page_count}, function(msg){    // 获取用户总数、以及某一指定分页的用户
                if(msg.error){
                    res.render('member', {'title': '成员 - Doc4Doc - 文档的文档' , 'user': req.session.user});
                }else{
                    res.render('member', {'title': '成员 - Doc4Doc - 文档的文档' , 'user': req.session.user, 'members': msg.objects, 
                        'n_all': msg.number, 'cur_page': page, 'n_per_page': page_count, 'n_posts': n_posts});
                }
            });
        });
    });
    

    // 站点地图
    app.get('/site-map', function (req, res){
        res.render('site-map', { title: '站点地图 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    // 下载页面
    app.get('/download', function (req, res){
        var file_upload_path = __dirname + '/../public/uploads/image';
        var msg = {};
        
        fs.readdir(file_upload_path, function(error, files){
            var msg = {};
            msg.files = [];
            if(error){
                res.render('download', { title: '下载', user: req.session.user});
                return;
            }
            for(var i = 0; i < files.length; ++i){
                file = {};
                file.name = files[i];    // 文件、文件夹名
                file_name = file_upload_path + '/' + files[i];
                st = fs.statSync(file_name);
                
                file.is_file = st.isFile();    // 是文件否 ? 
                file.is_directory = st.isDirectory();    // 是文件夹否 ? 
                file.create_time = st.ctime;
                file.size = st.size;
                msg.files.push(file);
            }
            //res.send(msg.files);
            res.render('download', {title: '下载 - Doc4Doc - 文档的文档', user: req.session.user, 'files': msg.files});
        });
    });
    
    // 上传页面
    app.get('/upload', function (req, res){
        res.render('upload', { title: '上传图片和文件 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    // 图片文件上传
    app.post('/file_image_upload', function (req, res){
        var ret = {};    // 返回对象
        if(!req.session.user){
            ret.error = { info: '你没有登录!'};
            res.send(ret);
            return;
        }
    
        var form = new formidable.IncomingForm();
        var file_upload_path = __dirname + '/../public/uploads/image';    // 上传文件所在的目录
        form.uploadDir = file_upload_path + '/tmp';    // 上传文件临时目录
        
        var upload_files = [], upload_fields = [];
        
        form
            .on('field', function(field, value){
                upload_fields.push(value);
            })
            .on('file', function(field, file){
                console.log(field, file);
                upload_files.push(file);
            });
        
        console.log('about to parse file upload form ... ');
        form.parse(req, function(error, fields, files){    // 解析参数， 上传文件
            var images = [];
            var imageModel = new Image();
            for(var i = 0; i < upload_files.length; ++i){
                var file = upload_files[i];
                new_file_path = file_upload_path + '/' + file.name;    // name, type, size
                
                if(fs.existsSync(new_file_path)){    // 
                    console.log('file name same ...');
                    var prefix = Date.now();
                    file.name = prefix+'-'+file.name;
                    new_file_path = file_upload_path + '/' + file.name;    // name, type, size
                }
                fs.renameSync(file.path, new_file_path);    // 将文件从临时文件夹 images/tmp 移到 image/ 下
                var image = {"name": file.name, "type": file.type, "size": file.size, "user_id": req.session.user._id.toString(), "upload_time": new Date()};
                images.push(image);
            }
            imageModel.insert(images, function(msg){
                if(msg.error){
                    ret.error = msg.error;
                }
                res.send(ret);
            });
        });
    });
    
    // 文档上传
    app.post('/file_doc_upload', function (req, res){
        var ret = {};    // 返回对象
        if(!req.session.user){
            ret.error = { info: '你没有登录!'};
            res.send(ret);
            return;
        }
    
        var form = new formidable.IncomingForm();
        var file_upload_path = __dirname + '/../public/uploads/doc';    // 上传文件所在的目录
        form.uploadDir = file_upload_path + '/tmp';    // 上传文件临时目录
        
        var upload_files = [], upload_fields = [];
        
        form
            .on('field', function(field, value){
                upload_fields.push(value);
            })
            .on('file', function(field, file){
                console.log(field, file);
                upload_files.push(file);
            });
        
        console.log('about to parse file upload form ... ');
        form.parse(req, function(error, fields, files){    // 解析参数， 上传文件
            console.log('parsing done ... ');
            var docs = [];
            var docModel = new Doc();
            for(var i = 0; i < upload_files.length; ++i){
                var file = upload_files[i];
                new_file_path = file_upload_path + '/' + file.name;    // name, type, size
                
                if(fs.existsSync(new_file_path)){    // 
                    console.log('file name same ...');
                    var prefix = Date.now();
                    file.name = prefix+'-'+file.name;
                    new_file_path = file_upload_path + '/' + file.name;    // name, type, size
                }
                fs.renameSync(file.path, new_file_path);    // 将文件从临时文件夹 images/tmp 移到 image/ 下
                var doc = {"name": file.name, "type": file.type, "size": file.size, "user_id": req.session.user._id.toString(), "upload_time": new Date()};
                docs.push(doc);
            }
            docModel.insert(docs, function(msg){
                if(msg.error){
                    ret.error = msg.error;
                }
                res.send(ret);
            });
        });
    });
    
    // 关于页面
    app.get('/about', function (req, res){
        res.render('about', { title: '关于我们 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    // 注销
    app.get('/logout', function (req, res){
        req.session.user = null;
        res.redirect('/');
    });
    
    // 登陆页面
    app.get('/login', function (req, res){
        res.render('login', {title: '登陆页面 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    // 注册页面
    app.get('/sign-up', function (req, res){
        res.render('sign-up', {title: '注册页面 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    
    // 文章页面
    app.get('/posts-all', function (req, res){
        var post = new Post();
        post.findOnePage({}, function(msg){
            res.render('post', { title: '所有短文 - Doc4Doc - 文档的文档', user: req.session.user, posts: msg.objects, ntabs: true});
        });
    });
    
    app.get('/get-one-page-of-posts', function (req, res){
        var postModel = new Post();
        var nskip = +req.query.nskip || 0;
        var n = +req.query.n || 10;
        var condition = {'nskip': nskip, 'n': n};
        
        if(req.query.cat && req.query.cat.trim() != ''){ // 分类
            condition.tags = {$all: [req.query.cat]};
        }
        if(req.query.project && req.query.project.trim() != ''){ // 项目
            condition.project = req.query.project;
        }
        if(req.query.user_id && req.query.user_id.trim() != ''){
            condition.user_id = req.query.user_id;
        }
        postModel.findOnePage(condition, function(msg){
            res.send(msg);
        });
    });
    
    
    // 个人文章页面
    app.get('/posts', function (req, res){
        if(!req.session.user){
            res.redirect('/login');
            return;
        }
        var postModel = new Post();
        postModel.findOnePage({user_id: req.session.user._id}, function(msg){
            res.render('post', { title: '所有短文 - Doc4Doc - 文档的文档', user: req.session.user, posts: msg.objects, other: req.session.user});
        });
    });
    
    // 图片墙页面
    app.get('/gallery-wall', function (req, res){
        var userModel = new User();
        var imageModel = new Image();
        
        userModel.findOne({'name': 'admin'}, function(msg){
            if(msg.error || !msg.object){
                res.render('index', { title: '图片墙 - Doc4Doc - 文档的文档', user: req.session.user, ntabs: true});    //
            }else{
                admin = msg.object;    // admin 账号
                imageModel.findOnePage({'user_id': admin._id.toString()}, function(msg){
                    if(msg.error){
                        res.render('gallery', { title: '图片墙 - Doc4Doc - 文档的文档', user: req.session.user, ntabs: true, 'other': null});    //
                    }else{
                        res.render('gallery', { title: '图片墙 - Doc4Doc - 文档的文档', user: req.session.user, gallery: msg.objects, ntabs: true, 'other': admin});    //
                    }
                });
            }
        });
    });
    
    // 相册页面
    app.get('/gallery', function (req, res){
        if(!req.session.user){
            res.redirect('/login');
            return;
        }
        var imageModel = new Image();
        imageModel.findOnePage({'user_id': req.session.user._id.toString()}, function(msg){
            res.render('gallery', { title: ''+req.session.user.name+'的相册 - Doc4Doc - 文档的文档', 'user': req.session.user, gallery: msg.objects, 'other': req.session.user});
        });
    });
    
    // 文件页面
    app.get('/file', function (req, res){
        if(!req.session.user){
            res.redirect('/login');
            return;
        }
        var docModel = new Doc();
        docModel.findOnePage({'user_id': req.session.user._id.toString()}, function(msg){
            res.render('file', { title: req.session.user.name+'的文件 - Doc4Doc - 文档的文档', 'user': req.session.user, files: msg.objects, 'other': req.session.user});
        });
    });
    
    // post-edit 编辑文章 post
    app.get('/post-edit', function (req, res){
        var post_id = req.query.post_id;

        if(!req.session.user || !post_id){    // 么有登陆， 或没有 post_id 参数
            res.render('post-edit', {title: '写点东西 - Doc4Doc - 文档的文档', user: req.session.user, no_post: true});
            return;
        }
        var postModel = new Post();
        postModel.findOne({"_id": new ObjectID(post_id)}, function(msg){   // 搜索对应的 post
            if(msg.error || !msg.object){    // 查询出错
                res.render('post-edit', { title: '写点东西', user: req.session.user});
            }else if(req.session.user.name != 'admin' && msg.object.user_id != req.session.user._id.toString()){   // post 非该用户所写， 管理员账号除外
                res.render('post-edit', { title: '写点东西 - Doc4Doc - 文档的文档', user: req.session.user});
            }else{   // 可以编辑， post 发过去
                post = msg.object;
                res.render('post-edit', { title: '写点东西 - Doc4Doc - 文档的文档', "post": post, user: req.session.user});
            }
        });
    });
    
    // 查看单个 post
    app.get('/post-show', function (req, res){
        var post_id = req.query.post_id;
        if(!post_id){    // 没有 post_id 参数
            res.redirect('/');
            return;
        }
        var postModel = new Post();
        postModel.findOne({"_id": new ObjectID(post_id)}, function(msg){
            if(msg.error || !msg.object){    // 查询出错
                res.render('/post-show', { title: '单个 post 页面 - Doc4Doc - 文档的文档', user: req.session.user});
            }else{    // 
                post = msg.object;
                res.render('post-show', { title: '单个 post 页面 - Doc4Doc - 文档的文档', "post": post, user: req.session.user});
            }
        });
    });
    
    app.get('/post-show/id/:_id', function (req, res){    //
        var post_id = req.params._id;
        // console.log(JSON.stringify(req.params));
        if(!post_id){    // 没有 post_id 参数
            res.redirect('/');
            return;
        }
        var postModel = new Post();
        postModel.findOne({"_id": new ObjectID(post_id)}, function(msg){
            console.log(JSON.stringify(msg));
            if(msg.error || !msg.object){    // 查询出错
                res.render('post-show', {title: '单个 post 页面 - Doc4Doc - 文档的文档', user: req.session.user, post: null});
            }else{    // 
                post = msg.object;
                res.render('post-show', {title: '单个 post 页面 - Doc4Doc - 文档的文档', "post": post, user: req.session.user});
            }
        });
    });
}

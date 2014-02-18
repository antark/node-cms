/* 
* ajax router
*/

// var util = require('util');
var cry = require('../model/cryption');

exports.map = function(app){
    // data 平台页面
    app.get('/data', function(req, res){
        res.render('data/data', { title: '数据平台页面 - Doc4Doc - 文档的文档', user: req.session.user});
    });
    
    app.get('/get-one-page-of-collection', function(req, res){
        var ret = {};
        if(!req.session.user){
            ret.error = {info: '没有登录'};
            res.send(ret);
            return;
        }
        if(req.session.user.name != 'admin'){
            ret.error = {info: '没有权限'};
            res.send(ret);
            return;
        }
        var collection = req.query.collection;
        var nskip = +req.query.nskip || 0, n = +req.query.n || 10;
        ret = {'string': '功能尚不完整 !'};
        
        res.send(ret);
    });
}
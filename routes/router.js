/* 
* router
*/

var page = require('./page.js');    // page map 文件
var ajax = require('./ajax.js');    // ajax map 文件
var data = require('./data.js');    // 数据平台 map 文件

exports.map = function(app){
    page.map(app);
    ajax.map(app);
    data.map(app);
    
    app.use(function(req, res, next){    // 定制 404 页面
        res.status(404).render('error-4xx', {title:'页面没有找到 - Page Not Found - Doc4Doc - 文档的文档'});
    });
};

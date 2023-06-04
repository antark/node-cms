/**
*    PageView 操作接口
*/
var db = require('./mongodb').db;

function PageView(){
    // url
    // count: 数量
}

exports.PageView = PageView;

PageView.prototype.addOnePv = async function(url){
    console.log("here:"+ url);
    await db.collection('pageview').updateOne({ url: url }, { $inc: { count: 1 } }, { upsert: true });
};

PageView.prototype.totalPv = async function() {
    var pv = await db.collection('pageview').find({}).toArray().then(records => records.map(x => x.count).reduce((partialSum, a) => partialSum + a, 0));
    return pv;
};



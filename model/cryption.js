/**
*    解密解密接口
*/

var crypto = require('crypto');

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc','Bb40E64d')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc','Bb40E64d')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.encrypt = encrypt;    // 加密算法
exports.decrypt = decrypt;    // 解密算法
const crypto = require('crypto-js');

exports.encrypt = function(text) {
    return crypto.AES.encrypt(text, 'nextukey');
}

exports.decrypt = function(ciphertext) {
    var bytes  = crypto.AES.decrypt(ciphertext.toString(), 'nextukey');
    var plaintext = bytes.toString(crypto.enc.Utf8);
    return plaintext;
}
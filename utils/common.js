const ripemd160 = require("crypto-js/ripemd160");
const crypto = require("crypto-js");
const _ = require('lodash');
const config = require('../config');
const iv = crypto.enc.Base64.parse('tiptap-iv');
const auth_key = crypto.enc.Base64.parse(config.server.auth_key);

const Common = (function (){

  const generatorStamps = (total, cnt = 0, resultArr = []) => 
    cnt >= total 
    ? resultArr 
    : generatorStamps(total, ++cnt, (_ => { resultArr.push(`stamp${cnt}`); return resultArr; })());

  const stamps = generatorStamps(29);

  return {
    encrypt: function (content) {
      return crypto.AES.encrypt(content, auth_key.toString(), {iv: iv}).toString();
    },
    decrypt: function (content) {
      return go(
        content,
        content => crypto.AES.decrypt(content + '', auth_key.toString(), {iv: iv}),
        bytes => bytes.toString(crypto.enc.Utf8)
      );
    },
    hash: function (content) {
      return ripemd160(content).toString();
    },
    imagesTypeCheck: function (images) {
      return go(images,
        every(v => ['JPG', 'JPEG', 'PNG', 'jpg', 'jpeg', 'png']
          .includes(
            last(v.name.split('.'))
          )
        )
      ) ? images : false
    },
    parameterFormCheck: curry((param, form) => (Object.keys(form).length === 0) ? true : isMatch(Object.keys(param), Object.keys(form))),
    getUrl: originalUrl => first(originalUrl.split('?')),
    getRemainStamp: current => go(
      stamps,
      reject(a => current.includes(a) ? a : undefined)
    ),
    getRandomStamp: arr => go(
      arr.length - 1,
      len => Math.floor(Math.random() * (len + 1)),
      index => arr[index]
    ),
    generateCertification: (value = Math.floor(Math.random() * 1000000) + 100000) => value > 1000000 ? value - 100000 : value
  }
})();

module.exports = Common;

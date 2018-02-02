const util = require('util');
const qiniu = require('qiniu');
let {accessKey, secretKey, bucket} = require('../config');

let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2; // todo 我是生成bucket选的华南
let bucketManager = new qiniu.rs.BucketManager(mac, config);
 let uploadFile = function(url, key) {
    return new Promise((resolve, reject) => {
        bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
            if (err) {
                reject(err);
            }else {
                if (respInfo.statusCode == 200) {
                    resolve({key: respBody.key,hash: respBody.hash, size: respBody.fsize, mimeType: respBody.mimeType});
                }else {
                    reject(JSON.stringify(respInfo));
                }
            }
        })
    })
};


module.exports = {
    uploadFile
};


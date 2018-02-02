let request = require('request');
function requestApi(options, adminSecret) {

    return new Promise(function (resolve, reject) {
        // console.log('-------------------------------------------------------------');
        // console.log(options);
        // console.log('-------------------------------------------------------------');
        request(options, function (error, response, body) {
            // console.log('**********************************************************');
            // console.log(body);
            // console.log('**********************************************************');
            try {
                body = typeof body == 'string' ? JSON.parse(body) : body;
                resolve(body);
            }catch(err) {
                reject(err);
            }
            if (body.success === 1) {
                resolve(body.result || body);
            } else {
                reject(body.msg || body.error);
            }
        })
    })
}




module.exports = {
    requestApi
};
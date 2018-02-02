let cp = require('child_process');
let path = require('path');

(async function() {
    let script = path.resolve(__dirname, '../js/filmDetail.js');
    let child = cp.fork(script, []);
    let flag = false;
    child.on('error', err => {
        if (flag) return ;
        flag = true;
        console.log(err);
    });

    child.on('exit', code => {
        if (flag) return;
        falg = true;
        let err = code === 0 ? null : new Error('exit code');
        console.log(err);
    });

    child.on('message', data => {
        let result = data.result;
        console.log(result);
    })
})();
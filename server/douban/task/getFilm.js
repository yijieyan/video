const cp = require('child_process');
const path = require('path');
const nanoid = require('nanoid');
require('../../libs/db');
let {uploadFile} = require('../../qiniu');
let Film = require('../../models/flim');
(async function() {
    let script = path.resolve(__dirname, '../js/getFilm.js');
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
        result.forEach(async (item) => {
            let f = await Film.findOne({
                id: item.doubanId
            });
            if (!f) {
                try {
                    let data = await uploadFile(item.poster, `${nanoid()}.jpg`);
                    await Film.create({
                        id: item.doubanId,
                        title: item.title,
                        rate: item.rate,
                        poster: `http://file.yanyijie.xyz/${data.key}`
                    });
                }catch(err) {
                    console.log(err);
                }

            }
        })
    })
})();
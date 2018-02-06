const router = require('koa-router')();
let util = require('../libs/util');
let User = require('../models/user');
let commonError = require('../libs/error');
let security = require('../libs/security');
let Film = require('../models/flim');
router.prefix('/video');


/**
 * 获取电影预告片列表
 */
router.get('/getVideoList', async (ctx, next) => {
    let {count = 10, page = 1, type='all'} = ctx.request.query;
    let data;
    if (type === 'all') {
        data = await Film.find({status: true}).select('-id -updatedAt -status').skip((page - 1) * count).limit(+count);
    } else {
        data = await Film.find({status: true, type}).select('-id -updatedAt -status').skip((page - 1) * count).limit(+count);
    }

    ctx.success(data);
});

router.get('/getVideoDetail', async (ctx, next) => {
    try {
        let {id} = ctx.request.query;
        let data = await Film.findOne({_id: id, status: true}).select('-id -updatedAt -status');
        ctx.success(data);
    }catch(err) {
        ctx.error('查询数据库出错', -1);
    }
});
module.exports = router;

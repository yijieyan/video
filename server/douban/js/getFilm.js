let puppeteer = require('puppeteer');

let sleep = function (timer) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        },timer)
    })
};

async function init() {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto('https://movie.douban.com/explore#!type=movie&sort=recommend&page_limit=20&tag=');
    console.log('开始爬取');
    await sleep(2000);

    await page.waitForSelector('.more');
    for (let i= 0; i< 2; i++) {
        await sleep(2000);
        await page.click('.more');
    }
    let data = await page.evaluate(() => {
        let $ = window.$;
        let arr = $('.list-wp .list a');
        let lists = [];
        arr.each((index, item) => {
            let it = $(item);
            let doubanId = it.find('div').data('id');
            let title = it.find('img').attr('alt');
            let rate = it.find('p').find('strong').text();
            let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');
            lists.push({
                doubanId,
                title,
                rate,
                poster
            })
        });
        return lists;
    });
    await browser.close();
    process.send({result: data});
    process.exit(0);

}

init();
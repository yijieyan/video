const puppeteer = require('puppeteer');
const nanoid = require('nanoid');
require('../../libs/db');
let {requestApi} = require('../../libs/ajax');
let {uploadFile} = require('../../qiniu');
let Film = require('../../models/flim');
let baseURI = `https://api.douban.com/v2/movie/subject/`;
let sleep = async (timer) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timer);
    })
};

(async () => {

    let films = await Film.find({});
    for(let i= 0; i< films.length; i++) {
        console.log(`第${i}次爬取数据，爬取中.....`);
        let item = films[i];
        let options = {
            method: 'get',
            url: `${baseURI}${item.id}`,
        };
        let data = await requestApi(options);
        let directors = [];
        data.directors.forEach(itemA => {
            directors.push(itemA.name)
        });
        let casts = [];
        data.casts.forEach(itemB => {
            casts.push(itemB.name);
        });
        await Film.update({id: item.id}, {$set: {
            year: new Date(data.year),
            countries: data.countries,
            type: data.genres,
            summary: data.summary,
            directors,
            casts
        }});


        try {
            let browser = await puppeteer.launch();
            let page = await browser.newPage();
            await page.goto(`https://movie.douban.com/subject/${item.id}`);
            await sleep(2000);
            let obj = await page.evaluate(() => {
                let $ = window.$;
                let src= '', link = '';
                let it = $('.related-pic-video');
                if (it && it.length > 0) {
                    src = it.find('img').attr('src');
                    link = it.attr('href');
                }
                return {
                    src,link
                }
            });

            if (!obj.link) {
                let data = {
                    link: '',
                    src: obj.src || '',
                    video: ''
                };

                let pic = '';
                if (obj.src) {
                    pic = await uploadFile(obj.src, `${nanoid()}.jpeg`);
                }

                await Film.update({id: item.id}, {$set: {
                    src: obj.src?`http://file.yanyijie.xyz/${pic.key}`: '',
                    video: ''
                }});
                continue;
            }
            await page.goto(`${obj.link}`);
            await sleep(2000);
            let videoUrl = await page.evaluate(async (page) => {
                let video = '';
                let $ = window.$;
                let it = $('video source');
                if (it && it.length > 0) {
                    video = it.attr('src');
                }
                return video;
            });
            let pic = '';
            if (obj.src) {
                pic = await uploadFile(obj.src, `${nanoid()}.jpeg`);
            }

            let video = '';
            if (videoUrl) {
                video = await uploadFile(videoUrl, `${nanoid()}.mp4`);
            }
            await Film.update({id: item.id}, {$set: {
                src: `http://file.yanyijie.xyz/${pic.key}`,
                video: `http://file.yanyijie.xyz/${video.key}`
            }});

            if (i === films.length - 1) {
                await browser.close();
                process.send({result: `已经爬取完成`});
                process.exit(0);
            }

        }catch(err) {
            console.log('出错了');
            continue;
        }
    }
})();
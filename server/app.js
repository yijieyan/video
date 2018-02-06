const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const views = require('koa-views');
const config = require('./config');
const serve = require('koa-static');
const db = require('./libs/db');
const error = require('./middleware/error');
const auth = require('./middleware/auth');


const public1 = require('./routes/public');
const users = require('./routes/users');
const index =require('./routes/index');
const video =require('./routes/video');

process.env.dataDir = __dirname;

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(error);
app.use(serve(__dirname + '/public'));
app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname + '/views', {
    extension: 'html'
}));



// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

app.use(auth);
// routes
app.use(public1.routes(), public1.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(index.routes(), index.allowedMethods());
app.use(video.routes(), video.allowedMethods());


app.listen(`${config.port}`);
console.log(`listen ${config.port} ...`);

module.exports = app;

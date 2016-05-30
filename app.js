/**
 * Created by kangdaye on 16/5/30.
 */
var path=require('path');
var koa=require('koa');
var koaStatic=require('koa-static');
var app = koa();
app.use(koaStatic(path.join(__dirname, 'static')));
app.use(require(path.join(__dirname, './model/grid/gridCtr')));

app.use(function *(){
    this.body = 'Hello World你的页面找不到了';
});

app.listen(3000);
module.exports = app;




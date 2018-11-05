let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let session = require('express-session');
let router = require('./routes/router');
let common = require('./controls/common');

let port = process.env.PORT || 9999;
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'fuckupig',
    cookie: { maxAge: 3600000 },
    resave: true,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    //设置跨域访问
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    } else {
        next();
    }
});
app.use('/uploads/*', (req,res,next)=>{
    common.getImage(req,res,next);
    return;
});
// 拦截所有请求
app.all('/*', (req, res, next) => {
    var jsPattern = /\.js$/;

    var url = req.originalUrl;
    if (jsPattern.test(url)) {
        // 公共部分，放行 next(); 
        return;
    } 
    if (url == '/api/user/login' || url == "/api/user/logout") {
        next();
        return;
    }
    let user = req.session.login;
    if (user) {
        next();
    } else {
        res.redirect('/');
    }
});

app.use(router);

app.listen(port, () => {
    console.log(`devServer start on port:${port}`);
});

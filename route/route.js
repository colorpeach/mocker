var user = require('../controller/user.js');
var mock = require('../controller/mock.js');
var page = require('../controller/page.js');
var tools = require('../controller/tools.js');

var settings = require('../settings');
var authPath = settings.authPath;
var authAjaxPath = settings.authAjaxPath;
var unauthAjaxPath = settings.unauthAjaxPath;
var unauthPath = settings.unauthPath;
var staticPath = settings.staticPath;
var validPath = authPath.concat(unauthPath,authAjaxPath,unauthAjaxPath,staticPath,'favicon.ico');

module.exports = function(app){
    //权限
    app.all('*',function(req,res,next){
        var path = req._parsedUrl.pathname.split('/')[1];

        if(validPath.indexOf(path) >= 0){
            
            if(!req.session.user){
                if(authAjaxPath.indexOf(path) >= 0){
                    //访问未授权信息
                    res.statusCode = 401;
                    res.end();
                    return;
                }else if(authPath.indexOf(path) >= 0){
                    //访问未授权页面
                    res.redirect('/login?backurl='+req.url);
                    return;
                }
            }
            
            next();
        }else{
            res.render('notfound',{user:req.session.user});
        }
    });
    
    //首页
    app.get('/',page.index);

    //登陆页面
    app.get('/login',page.login);

    //用户登录
    app.post('/login',user.login);

    //登出
    app.get('/logout',page.logout);

    //用户注册
    app.post('/register',user.register);

    //修改密码页面
    app.get('/modifypassword/:user',page.modifypassword);

    //用户修改密码
    app.post('/post/user/editpwd',user.post_editpwd);
    
    //工具
    app.get('/tools/:tool',tools.page);
    
    
    //查询mock项目
    app.get('/get/user/mocks',mock.get_user_mocks);
    
    //添加mock项目
    app.post('/post/add/mock',mock.post_add_mock);
    
    //删除mock项目
    app.post('/post/del/mock',mock.post_del_mock);
    
    //取得项目下所有接口文档
    app.get('/get/mock/detail',mock.get_mock_detail);
    
    //取得接口文档详细
    app.get('/get/mock/item',mock.get_mock_item);
    
    //添加单个接口文档
    app.post('/post/add/mock/item',mock.post_add_mock_item);
    
    //更新单个接口文档
    app.post('/post/update/mock/item',mock.post_update_mock_item);
    
    //删除单个接口文档
    app.post('/post/del/mock/item',mock.post_del_mock_item);
    
    //mock数据get
    app.get('/mock/:mockId/*',mock.get);
    
    //mock模板get ( 通过jsonp获取mock模板，兼容低版本浏览器跨域问题)
    app.get('/mocktpl/:mockId/*',mock.get_mock_tpl);
    
    //mock数据post
    app.post('/mock/:mockId/*',mock.post);
};

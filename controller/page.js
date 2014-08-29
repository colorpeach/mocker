var user = require('../models/user');

var page = {};

//首页
page.index = function(req,res){
    var data = {
        user:req.session.user,
        tools:[
            {
                'title':'Mock数据生成器',
                'name':'mock',
                'img':'mark-mock'
            }
        ]
    };
    res.render('index',data);
}

//登陆页面
page.login = function(req,res){
    var referer = req.headers.referer;
    res.render('login',{
        login:true,
        backurl:req.query.backurl || referer || '/'
    });
}

//登出
page.logout = function(req,res){
    req.session.destroy(function(){
        res.redirect(req.headers.referer||'/');
    });
}

//个人中心页面
page.account_User = function(req,res){
    if(req.session.user && req.params.user === req.session.user.login){
        res.render('account',{user:req.session.user});
    }else{
        user.query({username:req.params.user},function(data){
            if(data.length){
                if(req.session.user){
                    res.render('info',{user:req.session.user,owner:data[0]});
                }else{
                    res.render('info',{owner:data[0]});
                }
            }else{
                res.render('notfound');
            }
        });
    }
}

//修改密码页面
page.modifypassword = function(req,res){
    if(req.session.user && req.params.user === req.session.user.login){
        res.render('modifypassword',{user:req.session.user});
    }else{
        res.render('notfound');
    }
}
module.exports = page;


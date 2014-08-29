var user = require('../models/user');
var baseRes = require('./baseResponse');
var fs = require('fs');
var User = {};

//用户登录
User.login = function(req,res){
    user.query(req.body,function(list){
        if(list.length){
            req.session.user = list[0];
            res.end(baseRes());
        }else{
            res.end(baseRes({errorMsg:['用户名或密码不正确']}));
        }
    });
}

//用户注册
User.register = function(req,res){
    user.query({username:req.body.username},function(list){
        if(list.length){
            res.end(baseRes({errorMsg:['用户已存在']}));
        }else{
            user.add(req.body,function(data){
                req.session.user = data[0];
                res.end(baseRes());
            });
        }
    });
}

//用户修改密码
User.post_editpwd = function(req,res){
    var body = req.body,
        data = {
        username:body.username,
        password:body.oldpassword
    }
    user.query(data,function(list){
        if(!list.length){
            res.end(baseRes({errorMsg:['密码错误']}))
        }else{
                var data = {
                    password:body.newpassword
                }
            user.update(data,function(data){
                res.end(baseRes({successMsg:['修改成功']}));
            })
        }
    })
}

module.exports = User;

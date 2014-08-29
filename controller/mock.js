var Mock = {};
var mockjs = require("../client/lib/mock/mock.js");
var mock = require('../models/mock.js');
var generateMock = require('../client/utils/generateMock.js').action;
var baseRes = require('./baseResponse');
var self = this;

Mock.get_user_mocks = function(req,res){
    var user = req.session.user.login;
    mock.query({$or:[{user:user},{public:true}]},function(list){
        res.end(baseRes({mocks:list}));
    },{list:0});
};

Mock.post_add_mock = function(req,res){
    req.body.user = req.session.user.login;
    mock.add(req.body,function(data){
        res.end(baseRes({mock:data[0]}));
    });
};

Mock.post_del_mock = function(req,res){
    mock.queryDetail(req.body,function(list){
        var data = list[0];
        
        //只有mock项目的创建者才可以删除项目
        if(data.user !== req.session.user.login){
            res.end(baseRes({errorMsg:['你不是该项目创建者，没有权限删除']}));
        }else{
            mock.del(req.body,function(data){
                res.end(baseRes(data));
            });
        }
    },{'list.detail':0});
};

Mock.get_mock_item = function(req,res){
    var data = req.query;

    data.search = {
        'list.id':+data.id
    };

    mock.queryItem(data,function(data){
        res.end(baseRes({node:data[0].list}));
    });
};

Mock.get_mock_detail = function(req,res){
    mock.queryDetail(req.query,function(list){
        res.end(baseRes({nodes:list[0]}));
    },{'list.detail':0});
};

Mock.post_add_mock_item = function(req,res){
    mock.addItem(req.body,function(data){
        res.end(baseRes(data));
    });
};

Mock.post_update_mock_item = function(req,res){
    req.body.lastModifiyUser = req.session.user.login;
    mock.updateItem(req.body,function(data){
        res.end(baseRes({mock:data[0]}));
    });
};

Mock.post_del_mock_item = function(req,res){
    mock.deleteItem(req.body,function(){
        res.end(baseRes({}));
    });
};

Mock.get = function(req,res){
    var data = {
        _id : req.params.mockId
    };

    data.search = {
        'list.url':req.params[0],
        'list.method':'get'
    };

    mock.queryItem(data,function(data){
        var resData = generateMock(mockjs,safeGetValue(data,'0.list.response'));
        console.log(generateMock(mockjs,safeGetValue(data,'0.list.response'),true));
        res.set({
            'Access-Control-Allow-Origin':'*'
        });
        res.end(baseRes(resData));
    });
};

Mock.get_mock_tpl = function(req,res){
    var data = {
        _id : req.params.mockId
    };

    data.search = {
        'list.url':req.params[0],
        'list.method':req.query.method || 'get'
    };

    mock.queryItem(data,function(data){
        var resData = safeGetValue(data,'0.list') || {};
        resData.request = generateMock(mockjs,resData.request,true);
        resData.response = generateMock(mockjs,resData.response,true);
        
        res.jsonp(baseRes(resData));
    });
};

Mock.post = function(req,res){
    var data = {
        _id : req.params.mockId
    };

    data.search = {
        'list.url':req.params[0],
        'list.method':'post'
    };

    mock.queryItem(data,function(data){
        var resData = generateMock(mockjs,safeGetValue(data,'0.list.response'));
        res.set({
            'Access-Control-Allow-Origin':'*'
        });
        res.end(baseRes(resData));
    });
};

function safeGetValue(o,exp){
    var exps = exp.split('.');
    try{
        while(exp = exps.shift()){
            o = o[exp];
        }
        return o;
    }catch(e){
        return;
    }
}

module.exports = Mock;
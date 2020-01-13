'use strict';

let mongoose = require('mongoose')
// let Comment = mongoose.model('Comment')
let Content = mongoose.model('Content')
// let strip = require('strip');
let Comments = mongoose.model('Comment')
let Category = mongoose.model('Category')
// let File = mongoose.model('File')
let contentService = require('../../services/content')

//列表
/*exports.list = function(req, res) {
    let condition = {};
    let category = req.query.category;
    if(category) {
        condition.category = category;
    }
    //查数据总数
    Content.count(condition, function(err, total) {
        let query = Content.find(condition).populate('author', 'username name email');
        //分页
        let pageInfo = core.createPage(req.query.page, total, 30);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('app/content/list.hbs', {
                layout: 'app_layout',
                title: '内容列表',
                contents: results,
                pageInfo: pageInfo
            });
        });
    });
    
};*/
//单条
exports.one = async function(req, res) {
    let id = req.params.id;
    let condition = {}
    let newest = await contentService.find(condition, null, {
        limit: 10,
        sort: {
            created: -1 
        }
    })
    let hotest = await contentService.find(condition, null, {
        limit: 10,
        sort: {
            visits: -1
        }
    })
    let category = await Category.find(condition, null, {
        limit: 10,
        sort: {
            created: -1
        }
    })
    let comment = await Comments.find(condition, null, {
        limit: 10,
        sort: {
            created: -1
        }
    })

    Content.findById(id).populate('tags').populate('author').populate('category').populate('comments').populate('gallery').exec(function(err, result) {
        //console.log(result);
        if(!result) {
            return res.render('app/info.hbs', { layout:'app_layout',
                message: '该内容不存在'
            });
        }
        result.visits = result.visits + 1;
        result.save();
        res.render('app/content/item.hbs', {
            layout:'app_layout',
            title: result.title,
            description:result.content,
            keywords: result.keywords,
            content: result,
            newest: newest,//最新文章
            category:category,//文章分类
            comment:comment,//最新评论
            hotest: hotest//阅读排行榜
        });
    });
};
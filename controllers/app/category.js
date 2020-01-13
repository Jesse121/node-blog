'use strict';

let mongoose = require('mongoose')
let Category = mongoose.model('Category')
let Comments = mongoose.model('Comment')
let core = require('../../libs/core')
let contentService = require('../../services/content')
//列表
exports.list = async function(req, res) {
    let condition = {};
    condition.category = req.params.id
    let total = await contentService.count(condition)
    let pageInfo = core.createPage(req.query.page, total);
    let contents = await contentService.find(condition, null, {
        populate: 'author gallery',
        skip: pageInfo.start,
        limit: pageInfo.pageSize,
        sort: {
            created: -1
        }
    })
    let newest = await contentService.find({}, null, {
        limit: 10,
        sort: {
            created: -1 
        }
    })
    let hotest = await contentService.find({}, null, {
        limit: 10,
        sort: {
            visits: -1
        }
    })
    let category = await Category.find({}, null, {
        limit: 10,
        sort: {
            created: -1
        }
    })
    let comment = await Comments.find({}, null, {
        limit: 10,
        sort: {
            created: -1
        }
    })
    res.render('app/index.hbs', {
        layout: 'app_layout',
        contents: contents,
        pageInfo: pageInfo,
        total: total,//文章总篇数
        newest: newest,//最新文章
        category:category,//文章分类
        comment:comment,//最新评论
        hotest: hotest//阅读排行榜
    })
};

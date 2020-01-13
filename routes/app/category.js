'use strict';

let express = require('express')
let router = express.Router()
let Category = require('../../controllers/app/category')

//首页
router.route('/:id').all(Category.list);

module.exports = function(app) {
    app.use('/category', router);
};

var log4js = require('log4js');

let levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};

log4js.configure({
    appenders: {
        everything: { 
            type: 'dateFile', 
            filename: 'logs/application', // 需要手动创建此文件夹
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: { 
            appenders: [ 'everything' ], 
            level: 'debug' 
        }
    }
})

exports.logger = function (name, level) {
    var logger = log4js.getLogger(name);
    //默认为debug权限及以上
    logger.setLevel(levels[level] || levels['debug']);
    return logger;
};

exports.use = function (app, level) {
    //加载中间件
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: levels[level] || levels['info']
    }));
};
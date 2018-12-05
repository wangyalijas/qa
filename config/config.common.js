const domain = 'http://103.38.233.24:8084'
module.exports = {
    url: domain + '/public/courseware',
    // 黑白名单
    whitelist: ['::1', '::ffff:127.0.0.1', '::ffff:172.16.0.64', '::ffff:172.16.0.65', '::ffff:172.17.13.15'],
    blacklist: [],
}
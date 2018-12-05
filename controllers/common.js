const logUtil = require('../log/util')
const utilsType = require('../dtos/utils/index')
const commonService = require('../core/services/common')

module.exports = {
    // 修改基础用户表
    'PUT /api/putUser': [async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let result = new utilsType.Error()
            let data = ctx.request.body
            if (data) {
                result = await commonService.putUser(data)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }]
};
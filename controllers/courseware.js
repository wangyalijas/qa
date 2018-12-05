const logUtil = require('../log/util')
const utilsType = require('../dtos/utils/index')
const generic = require('../utils/generic')
const courseService = require('../core/services/courseware')

module.exports = {
    // 上传课件源文件
    'POST /api/postCourseware': [generic.dealAccessLog(), generic.addUploadFile('courseware/pdf').array('courseware', 12), async (ctx, next) => {
        const start = new Date();
        let ms;
        try {
            ctx.rest(ctx.req.files)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }],
    // 根据问卷id获取课件列表
    'GET /api/getCoursewareList': [async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let result = new utilsType.Error()
            let data = ctx.query
            if (data.name && data.questionnaireId) {
                result = await courseService.coursewarePDF2IMG(data.name, data.questionnaireId)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }]
};

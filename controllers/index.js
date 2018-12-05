const logUtil = require('../log/util')
const generic = require('../utils/generic')
const extension = require('../utils/extensions')
const utilsType = require('../dtos/utils/index')
const questionnaireType = require('../dtos/questionnaire/index')
const indexService = require('../core/services/index')

module.exports = {
    // 新增调查问卷
    'POST /api/postBuildQuestionnaire': [generic.dealAccessLog(), async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let data = ctx.request.body
            let result = new utilsType.Error()
            if (extension.verifyMatchObject(data, questionnaireType.Verify)) {
                result = await indexService.postBuildQuestionnaire(data)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }],
    // 获取调查问卷
    'GET /api/getQuestionnaire': [generic.dealAccessLog(), async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let data = ctx.query
            let result = new utilsType.Error()
            if (data.questionnaireId) {
                result = await indexService.getQuestionnaire(data)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }],
    // 获取调查问卷列表
    'GET /api/getQuestionnaireList': [generic.dealAccessLog(), async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let result = await indexService.getQuestionnaireList()
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }],
    // 提交问卷
    'POST /api/postSubmitQuestionnaire': [generic.dealAccessLog(), async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let data = ctx.request.body
            let result = new utilsType.Error()
            if (data.questionnaireId && data.selections && data.answers) {
                result = await indexService.postSubmitQuestionnaire(data)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }],
    // 获取分析结果
    'GET /api/getQuestionnaireStatic': [generic.dealAccessLog(), async (ctx, next) => {
        const start = new Date();
        var ms;
        try {
            let data = ctx.query
            let result = new utilsType.Error()
            if (data.questionnaireId) {
                result = await indexService.getQuestionnaireStatic(data)
            }
            ctx.rest(result)
        } catch (error) {
            ms = new Date() - start;
            logUtil.logError(ctx, error, ms)
        }
    }]
};
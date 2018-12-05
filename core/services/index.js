const Op = require('sequelize').Op
const path = require('path')
const uuidv4 = require('uuid/v4')
const qrCode = require('qrcode')
const extension = require('../../utils/extensions') // 扩展方法
const generic = require('../../utils/generic') // 通用方法

const CONSTANT = require('../../dtos/common/constant') // 常量
const verifyRule = require('../../utils/verify')
const utilsType = require('../../dtos/utils/index') // 通用类
const questionnaireType = require('../../dtos/questionnaire/index')
const selectionType = require('../../dtos/selection/index')
const optionType = require('../../dtos/option/index')
const answerType = require('../../dtos/answer/index')
const resultType = require('../../dtos/result/index')


const model = require('../models/index') // orm映射实体

// 实体
const sequelize = model.sequelize
const Questionnaire = model.Questionnaire
const Selection = model.Selection
const Result = model.Result
const Option = model.Option
const Answer = model.Answer

// 新增调查问卷
async function postBuildQuestionnaire(msg) {
    // 处理空字符串
    extension.DeleteSpecialProperty(msg, ['name', 'author', 'answers', 'selections'])
    // 不合法字段
    const illegalArr = extension.VerifyMatchRegular(msg, verifyRule.Questionnaire)
    if (illegalArr.length) {
        return new utilsType.Tips(false, `内容不符合要求，请重新输入！非法字段：${illegalArr.join(',')}`)
    }
    // 新增数据
    const GUID = uuidv4().toUpperCase();
    let result = null;

    try {
        await sequelize.transaction(t => {
            return Questionnaire.create(extension.CloneTo(msg, questionnaireType.Add, {
                GUID,
                selections: msg.selections.map(sel => ({
                    ...extension.CloneTo(sel, selectionType.Add),
                    options: sel.options.map(opt => ({
                        ...extension.CloneTo(opt, optionType.Add)
                    }))
                })),
                answers: msg.answers.map(ans => ({
                    ...extension.CloneTo(ans, answerType.Add)
                }))
            }), {
                include: [{
                    association: Questionnaire.Selections,
                    include: [Selection.Options]
                }, {
                    association: Questionnaire.Answers
                }],
                transaction: t
            }).then(async (questionnaire) => {
                const qrName = uuidv4().toLocaleUpperCase() + ".png"
                const qrUrl = path.resolve(__dirname, `../../static/img/qr/${qrName}`)
                await qrCode.toFile(qrUrl, CONSTANT.QR_URL_FE + GUID);
                await questionnaire.update({
                    qrcode: qrName
                }, {
                    transaction: t
                })
            }).catch(e => {
                throw e;
            })
        });
        result = new utilsType.Tips(true, '问卷创建完成！')
    } catch (e) {
        result = new utilsType.Tips(false, e.message, 500)
    }

    return result;
}

// 获取调查问卷
async function getQuestionnaire(msg) {
    const illegalArr = extension.VerifyMatchRegular(msg, verifyRule.Questionnaire)
    if (illegalArr.length) {
        return new utilsType.Tips(false, `内容不符合要求，请重新输入！非法字段：${illegalArr.join(',')}`)
    }
    let rawRes = await Questionnaire.find({
        where: {
            GUID: msg.questionnaireId,
            isActive: true
        },
        include: [{
            association: Questionnaire.Selections,
            include: [Selection.Options],
        }, {
            association: Questionnaire.Answers
        }],
        order: [
            [Questionnaire.Selections, 'sort'],
            [Questionnaire.Answers, 'sort'],
            [Questionnaire.Selections, Selection.Options, 'sort']
        ]
    })
    if (!rawRes) return new utilsType.Tips(false, '没有查找到符合问卷！', 404)
    // 数据格式化
    let result = extension.CloneTo(rawRes.dataValues, questionnaireType.Get, {
        startTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
        endTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
        qrcode: CONSTANT.QR_URL + rawRes.qrcode,
        selections: rawRes.dataValues.selections.map(sel => ({
            ...extension.CloneTo(sel.dataValues, selectionType.Get),
            options: sel.dataValues.options.map(opt => ({
                ...extension.CloneTo(opt.dataValues, optionType.Get)
            }))
        })),
        answers: rawRes.dataValues.answers.map(ans => ({
            ...extension.CloneTo(ans.dataValues, answerType.Get)
        }))
    })
    return result
}

// 获取问卷列表
async function getQuestionnaireList({userNo}) {
    let rawRes = await Questionnaire.findAll({
        where: {
            isActive: true
        },
        include: [{
          association: Questionnaire.Results,
          where: {
            userNo,
            isActive: true
          },
          require: false
        }]
    })
    return rawRes.map(item => extension.CloneTo(item.dataValues, questionnaireType.Get, {
        isChecked: item.Results.length,
        startTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', item.startTime),
        endTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', item.endTime),
        qrcode: CONSTANT.QR_URL + item.qrcode
    }))
}

// 提交问卷
async function postSubmitQuestionnaire(msg) {
    const illegalArr = extension.VerifyMatchRegular(msg, verifyRule.Questionnaire)
    if (illegalArr.length) {
        return new utilsType.Tips(false, `内容不符合要求，请重新输入！非法字段：${illegalArr.join(',')}`, 500)
    }
    // 检查是否过期
    // const now = Date.now()
    // const isAllow = await generic.isExit(Questionnaire, {
    //     GUID: msg.questionnaireId,
    //     startTime: {
    //         [Op.lt]: now
    //     },
    //     endTime: {
    //         [Op.gt]: now
    //     },
    //     isActive: true
    // })
    // if (!isAllow[0]) return new utilsType.Tips(false, '问卷不可做！', 500)
    // 提交
    const GUID = uuidv4().toUpperCase()
    await sequelize.transaction(t => {
        return Result.bulkCreate([...msg.answers.map(item => extension.CloneTo(item, resultType.AddAnswer, {
            GUID,
            questionnaireId: msg.questionnaireId,
            userNo: msg.userNo
        }))], {
            transaction: t
        })
    }).then(() => {
        result = new utilsType.Tips(true, '问卷已提交！')
    }).catch(err => {
        result = new utilsType.Tips(false, err.original.sqlMessage, 500)
    })
    return result
}

// 获取分析结果
async function getQuestionnaireStatic(msg) {
    const illegalArr = extension.VerifyMatchRegular(msg, verifyRule.Questionnaire)
    if (illegalArr.length) {
        return new utilsType.Tips(false, `内容不符合要求，请重新输入！非法字段：${illegalArr.join(',')}`, 500)
    }
    let rawRes = await Questionnaire.find({
        where: {
            GUID: msg.questionnaireId,
            isActive: true
        },
        include: [{
            association: Questionnaire.Selections,
            include: [{
                association: Selection.Options,
                include: [Option.OptionResults]
            }]
        }, {
            association: Questionnaire.Answers,
            include: [Answer.AnswerResults]
        }]
    })
    // 数据格式化
    let result = extension.CloneTo(rawRes.dataValues, questionnaireType.Get, {
        startTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
        endTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
        qrcode: CONSTANT.QR_URL + rawRes.qrcode,
        selections: rawRes.dataValues.selections.map(sel => ({
            ...extension.CloneTo(sel.dataValues, selectionType.Get),
            options: sel.dataValues.options.map(opt => ({
                ...extension.CloneTo(opt.dataValues, optionType.Get),
                count: opt.dataValues.result.length
            }))
        })),
        answers: rawRes.dataValues.answers.map(ans => ({
            ...extension.CloneTo(ans.dataValues, answerType.Get),
            answerContents: ans.dataValues.result.map(item => item.answerContent)
        }))
    })

    return result
}

module.exports = {
    postBuildQuestionnaire,
    getQuestionnaire,
    getQuestionnaireList,
    postSubmitQuestionnaire,
    getQuestionnaireStatic
}

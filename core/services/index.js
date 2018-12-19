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
const coursewareType = require('../../dtos/courseware/index')


const model = require('../models/index') // orm映射实体

// 实体
const sequelize = model.sequelize
const Questionnaire = model.Questionnaire
const Selection = model.Selection
const Result = model.Result
const User = model.UserEntity
const Option = model.Option
const Answer = model.Answer
const Courseware = model.Courseware
const UserQuestionnaire = model.UserQuestionnaire

const coursewarePDF2IMG = require('./courseware').coursewarePDF2IMG
const Excel = require('exceljs')
// 新增调查问卷
async function postBuildQuestionnaire(msg) {
  // 处理空字符串
  extension.DeleteSpecialProperty(msg, ['name', 'author', 'answers', 'selections', 'describe'])
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
        if (msg.coursewares && msg.coursewares.length) {
          for (let i = 0; i < msg.coursewares.length; i++) {
            await Courseware.create(extension.CloneTo(msg.coursewares[i], coursewareType.Add, {
              questionnaireId: questionnaire.GUID
            }), {
              transaction: t
            }).then(async (courseWare) => {
              // console.log(coursewarePDF2IMG(courseWare.dataValues.path, courseWare.dataValues.questionnaireId))
            }).catch(e => {
              throw e;
            })
          }
        }
      })
    }).catch(e => {
      throw e;
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

async function getCompletedQuestionnaire(msg) {
  const illegalArr = extension.VerifyMatchRegular(msg, verifyRule.Questionnaire)
  if (illegalArr.length) {
    return new utilsType.Tips(false, `内容不符合要求，请重新输入！非法字段：${illegalArr.join(',')}`)
  }
  let rawRes = await Questionnaire.find({
    where: {
      GUID: msg.questionnaireId,
      isActive: true
    },
    include: [
      {
        association: Questionnaire.UserQuestionnaires,
        where: {
          userNo: msg.userNo,
          isActive: true
        },
        required: false
      },
      {
        association: Questionnaire.Selections,
        include: [Selection.Options],
      },
      {
        association: Questionnaire.Answers,
        include: [
        {
          association: Answer.AnswerResults,
          where: {
            userNo: msg.userNo,
            questionnaireId: msg.questionnaireId,
            isActive: true
          },
          required: false
        }
        ]
      }
      ],
    order: [
      [Questionnaire.Selections, 'sort'],
      [Questionnaire.Answers, 'sort'],
      [Questionnaire.Selections, Selection.Options, 'sort']
    ]
  })
  if (!rawRes) return new utilsType.Tips(false, '没有查找到符合问卷！', 404)
  // 数据格式化
  let result = extension.CloneTo(rawRes.dataValues, questionnaireType.Get, {
    isChecked: rawRes.UserQuestionnaires.length,
    startTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
    endTime: generic.formatTime('yyyy-MM-dd hh:mm:ss', rawRes.startTime),
    qrcode: CONSTANT.QR_URL + rawRes.qrcode,
    selections: rawRes.dataValues.selections.map(sel => ({
      ...extension.CloneTo(sel.dataValues, selectionType.CompletedGet, {
        result: sel.dataValues.type === 'Selection' ? sel.dataValues.options.map(opt => {
          if(!opt.isRight) {
            return
          }
          return opt.id
        }).filter(item => item).shift() : sel.dataValues.options.map(opt => {
          if(!opt.isRight) {
            return
          }
          return opt.id
        }).filter(item => item)
      }),
      options: sel.dataValues.options.map(opt => ({
        ...extension.CloneTo(opt.dataValues, optionType.Get)
      }))
    })),
    answers: rawRes.dataValues.answers.map(ans => ({
      ...extension.CloneTo(ans.dataValues, answerType.CompletedGet, {
        result: ans.dataValues.result.pop().dataValues.answerContent
      })
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
      association: Questionnaire.UserQuestionnaires,
      where: {
        userNo,
        isActive: true
      },
      required: false
    }],
    order: ['id']
  })
  return rawRes.map(item => extension.CloneTo(item.dataValues, questionnaireType.Get, {
    isChecked: item.UserQuestionnaires.length,
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
  const GUID = uuidv4().toUpperCase()
  await sequelize.transaction(t => {
    return Result.bulkCreate([...msg.answers.map(item => extension.CloneTo(item, resultType.AddAnswer, {
      GUID,
      questionnaireId: msg.questionnaireId,
      userNo: msg.userNo
    }))], {
      transaction: t
    }).then(() => {
      return UserQuestionnaire.create({
        questionnaireId: msg.questionnaireId,
        userNo: msg.userNo
      })
    })
  }).then(() => {
    result = new utilsType.Tips(true, '问卷已提交！')
  }).catch(err => {
    result = new utilsType.Tips(false, err.original.sqlMessage, 500)
  })
  return result
}

// 打印
async function getQuestionnaireStatic({dates}) {
  let datesHandles = dates.split(",");

  let excelData = [];
  for (let i = 0; i < datesHandles.length; i++) {
    let orgin = await User.findAll({
      attributes: ['name', 'userNo', 'department'],
      where: {
        isActive: true
      },
      include: [{
        attributes: ['answerId', 'answerContent', 'createdAt', 'GUID'],
        where: {
          [Op.and]: [
            sequelize.literal("substring(convert_tz(`userResult`.`createdAt`, '+00:00','+08:00') ,1,10) = '"+datesHandles[i]+"' and `userResult`.`isActive` = true")
          ]
        },
        association: User.userResult,
        'order': "answerId DESC"
      }]
    })
    let orginHandler = orgin.map(item =>
      [item.dataValues.name,
      item.dataValues.userNo,
      item.dataValues.department,
      ...item.dataValues.userResult.map(result => result.dataValues.answerContent)]
    )
    excelData.push({
      sheetName: datesHandles[i],
      rowNames: ['姓名', '工号', '部门', 's', ''],
      data: orginHandler
    })
  }
  const GUID = uuidv4().toUpperCase();
  let result = await data2Excel(excelData, GUID)
  return result
}

// 导出Excel
async function data2Excel(msg, fileName) {
  // 整理成表格
  let workbook = new Excel.Workbook();
  for (let i = 0; i < msg.length; i++) {
    //add header
    let ws = workbook.addWorksheet(msg[i].sheetName);
    ws.addRow(msg[i].rowNames);
    msg[i].data.map(item => {
      ws.addRow(item)
    })
  }
  await workbook.xlsx.writeFile(`static/download/${fileName}.xlsx`)
    .then(() => {
      result = new utilsType.Tips(true, `/download/${fileName}.xlsx`)
    }).catch(() => {
      result = utilsType.Tips(false, '下载失败，请重试！')
    })
  return result
}

module.exports = {
  postBuildQuestionnaire,
  getQuestionnaire,
  getCompletedQuestionnaire,
  getQuestionnaireList,
  postSubmitQuestionnaire,
  getQuestionnaireStatic
}

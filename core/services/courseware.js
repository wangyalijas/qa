const fs = require('fs')
const path = require('path')
const pdf2img = require('pdf2img')
const extension = require('../../utils/extensions') // 扩展方法
const generic = require('../../utils/generic') // 通用方法
const utilsType = require('../../dtos/utils/index') // 通用类
const coursewareType = require('../../dtos/courseware/index')

// 实体
const model = require('../models/index') // orm映射实体
const CourseWare = model.Courseware

// 根据问卷id获取课件列表
async function getCoursewareList(msg) {
  const courseWare = await CourseWare.findAll({
    where: {
      questionnaireId: msg.questionnaireId,
      isActive: true
    },
    raw: true
  })
  return courseWare.map(item => extension.CloneTo(item, coursewareType.Get))
}

// 课件pdf转img图片
async function coursewarePDF2IMG(name, questionnaireId) {
    const pdfAddress = path.resolve(__dirname, '../../static/courseware/pdf/' + name)
    const imgAddress = path.resolve(__dirname, '../../static/courseware/cover/')
    pdf2img.setOptions({
        type: 'png',
        size: 1024,
        density: 600,
        outputdir: imgAddress,
        outputname: questionnaireId
    });
    await new Promise((resolve, reject) => {
        pdf2img.convert(pdfAddress, function (err, info) {
            err ? reject(err) : resolve(info)
        })
    }).then((data) => {
        console.log(data)
    }).catch(err => {
        console.log(err)
    })
}


module.exports = {
    getCoursewareList,
    coursewarePDF2IMG
}

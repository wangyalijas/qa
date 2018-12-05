const fs = require('fs')
const path = require('path')
const pdf2img = require('pdf2img')

const generic = require('../../utils/generic') // 通用方法
const utilsType = require('../../dtos/utils/index') // 通用类


// 实体
const model = require('../models/index') // orm映射实体

// 根据问卷id获取课件列表
async function getCoursewareList(msg) {

}

// 课件pdf转img图片
async function coursewarePDF2IMG(name, questionnaireId) {
    const pdfAddress = path.resolve(__dirname, '../../public/courseware/pdf/' + name)
    const imgAddress = path.resolve(__dirname, '../../public/courseware/img/')
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
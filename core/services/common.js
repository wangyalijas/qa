const model = require('../models/index') // orm映射实体
const generic = require('../../utils/generic') // 通用方法
const userType = require('../../dtos/user_entity/index') // 用户类

// 实体
const AccessLog = model.AccessLog
const User = model.UserEntity

// 用户处理操作日志
async function postAccessLog(msg) {
    await AccessLog.create({
        userNo: msg.query.userNo ? msg.query.userNo : null,
        token: msg.headers['x-token'] ? msg.headers['x-token'] : null,
        api: msg.request.path,
        ip: msg.request.ip,
        query: msg.query ? JSON.stringify(msg.query) : null,
        // request: msg.request.body ? JSON.stringify(msg.request.body) : null
    })
}

// 更新员工数据
async function putUser(msg) {
    let data = msg.QueryResult.records
    // 查找用户是否存在
    for (let i = 0; i < data.length; i++) {
        let isExit = await generic.isExit(User, {
            userNo: data[i].values[0].$value,
            isActive: true
        })
        // 不存在插入
        if (!isExit[0]) {
            await User.create(new userType.Put(data[i].values))
        }
        // 存在则更新
        else {
            await User.update(new userType.Put(data[i].values), {
                where: {
                    userNo: data[i].values[0].$value
                }
            })
        }
    }
}

module.exports = {
    postAccessLog,
    putUser
}
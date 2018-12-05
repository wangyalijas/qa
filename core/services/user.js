const model = require('../models/index') // orm映射实体
const generic = require('../../utils/generic') // 通用方法
const utilsType = require('../../dtos/utils/index') // 通用类

const userType = require('../../dtos/user_entity/index') // 用户类


// 实体
const User = model.UserEntity

// 更新员工数据
async function putUser(msg) {
    let data = msg.QueryResult.records
    try {
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
        return new utilsType.Tips(true, '更新成功！', 200)
    } catch (error) {
        return new utilsType.Error(false, `更新失败，请查看日志！${error.message}`, 500)
    }
}

// 用户登录
async function postLogin(msg) {
    const user = await User.find({
        attributes: ['id', 'name', 'userNo'],
        where: {
            userNo: msg.userNo,
            name: msg.name,
            isActive: true
        },
        raw: true
    })
    if (!user) return new utilsType.Error(false, '未找到用户信息，请在12点后重试！', 403)
    return user
}

module.exports = {
    postLogin,
    putUser
}
module.exports = {
    // 问卷单选题添加类
    Add: class Add {
        constructor(name, sort, isRight) {
            this.name = name;
            this.sort = sort;
            this.isRight = isRight;
        }
    },
    Get: class Get {
        constructor(id, name, sort) {
            this.id = id;
            this.name = name;
            this.sort = sort;
        }
    }
}

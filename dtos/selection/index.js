module.exports = {
    // 问卷单选题题目添加类
    Add: class Add {
        constructor(name, sort, type) {
            this.name = name;
            this.sort = sort;
            this.type = type;
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

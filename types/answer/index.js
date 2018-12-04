module.exports = {
    // 问卷客观题添加类
    Add: class Add {
        constructor(name, sort) {
            this.name = name;
            this.sort = sort;
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
module.exports = {
    // 问卷客观题添加类
    Add: class Add {
        constructor(name, sort) {
            this.name = name;
            this.sort = sort;
        }
    },
    Get: class Get {
        constructor(id, name, sort, placeHolder) {
            this.id = id;
            this.name = name;
            this.sort = sort;
            this.placeHolder = placeHolder;
        }
    },
    CompletedGet: class  CompletedGet{
      constructor(id, name, sort, placeHolder, result) {
        this.id = id;
        this.name = name;
        this.sort = sort;
        this.placeHolder = placeHolder;
        this.result = result;
      }
    }
}

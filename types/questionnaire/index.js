module.exports = {
    Verify: class Verify {
        constructor(data) {
            this.name = data.name;
            this.selections = data.selections;
            this.answers = data.answers;
            this.author = data.author;
        }
    },
    // 问卷添加类
    Add: class Add {
        constructor(name, author, startTime, endTime, sort) {
            this.name = name;
            this.author = author;
            this.startTime = startTime;
            this.endTime = endTime;
            this.sort = sort;
        }
    },
    Get: class Get {
        constructor(GUID, name, author, startTime, endTime, sort) {
            this.GUID = GUID;
            this.name = name;
            this.author = author;
            this.startTime = startTime;
            this.endTime = endTime;
            this.sort = sort;
        }
    }
}
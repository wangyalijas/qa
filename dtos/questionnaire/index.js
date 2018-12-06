module.exports = {
    Verify: class Verify {
        constructor(data) {
            this.name = data.name;
            this.selections = data.selections;
            this.answers = data.answers;
            this.author = data.author;
            this.describe = data.describe;
        }
    },
    // 问卷添加类
    Add: class Add {
        constructor(name, author, startTime, endTime, sort, isHobby, describe) {
            this.name = name;
            this.author = author;
            this.startTime = startTime;
            this.endTime = endTime;
            this.sort = sort;
            this.isHobby = isHobby;
            this.describe = describe;
        }
    },
    Get: class Get {
        constructor(GUID, name, author, startTime, endTime, sort, isHobby, describe) {
            this.GUID = GUID;
            this.name = name;
            this.author = author;
            this.startTime = startTime;
            this.endTime = endTime;
            this.sort = sort;
            this.isHobby = isHobby;
            this.describe = describe;
        }
    }
}

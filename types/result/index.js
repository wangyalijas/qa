module.exports = {
    // 问卷提交题目添加类
    AddSelection: class Add {
        constructor(selectionId, optionId) {
            this.selectionId = selectionId;
            this.optionId = optionId;
        }
    },
    AddAnswer: class Get {
        constructor(answerId, answerContent) {
            this.answerId = answerId;
            this.answerContent = answerContent;
        }
    }
}
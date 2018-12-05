module.exports = {
    Add: class Add {
        constructor(userNo, password, name, gender, status, company, department, job, directorNo, directorName, email) {
            this.userNo = userNo;
            this.password = password;
            this.name = name;
            this.gender = gender;
            this.status = status;
            this.company = company;
            this.department = department;
            this.job = job;
            this.directorNo = directorNo;
            this.directorName = directorName;
            this.email = email;
        }
    },
    Show: class Show {
        constructor(id, userNo, name) {
            this.id = id;
            this.userNo = userNo;
            this.name = name;
        }
    },
    Put: class Put {
        constructor(data) {
            this.userNo = data ? data[0].$value : null;
            this.name = data ? data[1].$value : null;
            this.status = data ? data[7].$value : null;
            this.department = data ? data[2].$value : null;
            this.directorNo = data ? data[3].$value : null;
            this.directorName = data ? data[4].$value : null;
            this.email = data ? data[8].$value : null;
        }
    }
}
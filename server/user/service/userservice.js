const MysqlDBService = require('../../common/service/mysqldbservice.js');
class UserService extends MysqlDBService {
    constructor() {
        super();
    }

    async insertUser() {
        return await this.executeQuery(`INSERT INTO user(name) VALUES (?)`, [`User_${+ new Date()}`])
    }

};

module.exports = new UserService();
const MysqlDBService = require('../../common/service/mysqldbservice.js');

class ChallengeService extends MysqlDBService {
    constructor() {
        super();
    }

    async getChallenge() {
        return await this.executeQuery(`SELECT text FROM challenge WHERE 1 ORDER BY rand() LIMIT 1`);
    }
};

module.exports = new ChallengeService();

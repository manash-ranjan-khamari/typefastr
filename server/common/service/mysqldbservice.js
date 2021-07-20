const mysql = require('mysql');
const config = require('../../../config/appconfig.js');

class MySqlDBService {
    constructor() {
        this.mysqlConnectionPool = mysql.createPool(config.mysql);
    }

    executeQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.mysqlConnectionPool.query(query, params, (error, results, fields) => {
                if (error) reject(error);
                
                resolve(results);
            });
        });
    }
};

module.exports = MySqlDBService;
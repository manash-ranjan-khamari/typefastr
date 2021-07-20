const MysqlDBService = require('../../common/service/mysqldbservice.js');
const todolistService = require('../../todolist/service/todolistservice.js');
const userTodolistTableName = 'user_todolist';
const unitTestUserTodolistTableName = `${userTodolistTableName}_test`;
const userTaskTableName = 'user_task';
const unitTestUserTaskTableName = `${userTaskTableName}_test`;

class UserService extends MysqlDBService {
    constructor() {
        super();
    }

    async shareTodoList(params, unitTest) {
        return await this.executeQuery(`INSERT INTO ${unitTest ? unitTestUserTodolistTableName : userTodolistTableName} SET ?`, params);
    }

    async addUserTask(params, unitTest) {
        const userTaskAlreadyInProgress = await this.checkIfUserTaskAlreadyInProgress(params, unitTest);
        if (userTaskAlreadyInProgress?.length) {
            return Promise.reject(new Error(`Task ID ${userTaskAlreadyInProgress[0].id} already in Progress. Please finish it first`));
        }

        return await this.executeQuery(`INSERT INTO ${unitTest ? unitTestUserTaskTableName : userTaskTableName} SET ?`, params);
    }

    async checkIfUserTaskAlreadyInProgress({userId, taskId}, unitTest) {
        return await this.executeQuery(`SELECT * FROM ${unitTest ? unitTestUserTaskTableName : userTaskTableName} WHERE userId = ? AND taskId = ? AND task_status = 'In Progress'`, [userId, taskId]);
    }

    async getUserTask(id, unitTest) {
        return await this.executeQuery(`SELECT * FROM ${unitTest ? unitTestUserTaskTableName : userTaskTableName} WHERE id = ?`, [id]);
    }

    async updateUserTask({id, completeTask}, unitTest) {
        if (completeTask) {
            await this.executeQuery(`UPDATE ${unitTest ? unitTestUserTaskTableName : userTaskTableName} SET task_status = 'Completed' where id = ?`, [id]);
            await this.executeQuery(`UPDATE ${unitTest ? unitTestUserTaskTableName : userTaskTableName} SET timeSpent = TIMESTAMPDIFF(SECOND, startTime, endTime) where id = ?`, [id]);

            const userTaskData = await this.getUserTask(id, unitTest);
            if (userTaskData?.length) {
                todolistService.updateTask({id: userTaskData[0].taskId, timeSpent: userTaskData[0].timeSpent});
            }
        }
    }

    async softDeleteTodoList({todoId, unitTest}) {
        return await this.executeQuery(`UPDATE ${unitTest ? unitTesttodoListTableName : todoListTableName} SET active = false where id = ?`, [todoId]);
    }

};

module.exports = new UserService();
const MysqlDBService = require('../../common/service/mysqldbservice.js');
const todoListMapper = require('../mapper/todolistmapper.js');
const todoListTableName = 'todolist';
const unitTesttodoListTableName = `${todoListTableName}_test`;
const taskTableName = 'task';
const unitTesttaskTableName = `${taskTableName}_test`;

class TodoListService extends MysqlDBService {
    constructor() {
        super();
    }

    async addTodoList(params, unitTest) {
        return await this.executeQuery(`INSERT INTO ${unitTest ? unitTesttodoListTableName : todoListTableName} SET ?`, params);
    }

    async addTask(params, unitTest) {
        return await this.executeQuery(`INSERT INTO ${unitTest ? unitTesttaskTableName : taskTableName} SET ?`, params);
    }

    async softDeleteTodoList({todoId, unitTest}) {
        return await this.executeQuery(`UPDATE ${unitTest ? unitTesttodoListTableName : todoListTableName} SET active = false where id = ?`, [todoId]);
    }

    async updateTask({id, timeSpent}, unitTest) {
        this.executeQuery(`UPDATE ${unitTest ? unitTesttaskTableName : taskTableName} SET timeSpent = timeSpent + ${timeSpent} where id = ?`, [id]);
    }

    async getTodoListDetails({id}, unitTest) {
        return todoListMapper.mapTodoList(await Promise.all([this.executeQuery(`SELECT tl.id as todoListId, tl.title as todoListTitle, tl.description as todoListDescription, tl.active as todoListStatus,
            t.id as taskId, t.title as taskTitle, t.description as taskDescription, t.dueDateTime, t.timeSpent as taskTimeSpent, t.active as taskStatus
            FROM todolist tl 
                INNER JOIN task t ON tl.id = t.todoListId 
            WHERE ${id ? `tl.id = ${id}` : '1'}`), this.executeQuery(`SELECT t.id as taskId, u.name as userName, u.active as userStatus, 
            ut.startTime, ut.endTime, ut.timeSpent as userTaskTimeSpent
            FROM todolist tl 
                INNER JOIN task t ON tl.id = t.todoListId 
                INNER JOIN user_task ut ON ut.taskId = t.id 
                INNER JOIN user u ON ut.userId = u.id 
            WHERE ${id ? `tl.id = ${id}` : '1'}`)]));
    }
};

module.exports = new TodoListService();
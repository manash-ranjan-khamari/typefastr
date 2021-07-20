const BaseController = require('../../common/controller/basecontroller');
const userService = require('../service/userservice.js');

class UserController extends BaseController {
    constructor() {
        super();
    }

    async shareTodoList(req, res, next) {
        try {
            await userService.shareTodoList({
                senderId: req.body.senderId,
                receipientId: req.body.receipientId,
                todoListId: req.body.todoListId
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: 201, model: `Todolist Shared successfully from Sender ${req.body.senderId} to Receipient ${req.body.receipientId}`});
        } catch(err) {
            return this.sendApiResponse({res, status: ['ER_NO_REFERENCED_ROW_2', 'ER_DUP_ENTRY'].includes(err?.code) ? 400 : 500, model: err.message});
        }
    }

    async addUserTask(req, res, next) {
        try {
            await userService.addUserTask({
                userId: req.body.userId,
                taskId: req.body.taskId
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: 201, model: 'User Task Added successfully'});
        } catch(err) {
            return this.sendApiResponse({res, status: 500, model: err.message});
        }
    }

    async updateUserTask(req, res, next) {
        try {
            await userService.updateUserTask({
                id: req.body.id,
                completeTask: req.body.completeTask
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: 201, model: 'User Task marked as completed'});
        } catch(err) {
            return this.sendApiResponse({res, status: 500, model: err.message});
        }
    }

    getUser(req, res, next) {

    }
}

module.exports = UserController;

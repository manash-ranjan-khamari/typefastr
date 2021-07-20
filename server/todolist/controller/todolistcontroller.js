const BaseController = require('../../common/controller/basecontroller.js');
const todoListService = require('../service/todolistservice.js');

class TodoListController extends BaseController {
    constructor() {
        super();
    }

    async addTodoList(req, res, next) {
        try {
            await todoListService.addTodoList({
                title: req.body.title,
                description: req.body.description
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: 201, model: 'Todolist added successfully'});
        } catch(err) {
            return this.sendApiResponse({res, status: 500});
        }
    }

    async addTask(req, res, next) {
        try {
            await todoListService.addTask({
                title: req.body.title,
                description: req.body.description,
                todoListId: req.body.todoListId,
                dueDateTime: req.body.dueDateTime
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: 201, model: 'Task added successfully'});
        } catch(err) {
            return this.sendApiResponse({res, status: ['ER_NO_REFERENCED_ROW_2', 'ER_DUP_ENTRY'].includes(err?.code) ? 400 : 500, model: err?.message});
        }
    }

    async getTodoListDetails(req, res, next) {
        try {
            const todoData = await todoListService.getTodoListDetails({
                id: req.query.id
            });
            return this.sendApiResponse({res, status: 200, model: todoData});
        } catch(err) {
            return this.sendApiResponse({res, status: 500});
        }
    }

    async deleteTodoList(req, res, next) {
        try {
            const updateProductData = await todoListService.softDeleteProduct({
                productId: req.params.productId,
                unitTest: req.query.unitTest 
            });
            return this.sendApiResponse({res, status: 200, model: updateProductData});
        } catch(err) {
            return this.sendApiResponse({res, status: 500});
        }
    }

    async deleteTask(req, res, next) {
        try {
            const updateProductData = await todoListService.softDeleteProduct({
                productId: req.params.productId,
                unitTest: req.query.unitTest 
            });
            return this.sendApiResponse({res, status: 200, model: updateProductData});
        } catch(err) {
            return this.sendApiResponse({res, status: 500});
        }
    }
}

module.exports = TodoListController;

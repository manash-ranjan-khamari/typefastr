const TodoListController = require('./server/todolist/controller/todolistcontroller.js');
const TodoListValidator = require('./server/todolist/validator/todolistvalidator.js');
const UserController = require('./server/user/controller/usercontroller.js');
const UserValidator = require('./server/user/validator/uservalidator.js');

class Routes {
    _getMethodLoader(Obj, method) {
        return function (req, res, next) {
            const controller = new Obj();

            controller[method].bind(controller)(req, res, next);
        };
    }

    exposeRoutes(app) {
        app.get('/', (req, res) => {
            res.send('Welcome to API Codebase');
        });
        app.get('/health', (req, res) => {
            res.send('Service is up.');
        });
        app.post('/todolist', TodoListValidator.addTodoList, this._getMethodLoader(TodoListController, 'addTodoList'));
        app.get('/todolist', TodoListValidator.getTodoList, this._getMethodLoader(TodoListController, 'getTodoListDetails'));
        app.post('/todolist/task', TodoListValidator.addTask, this._getMethodLoader(TodoListController, 'addTask'));
        app.post('/todolist/share', UserValidator.shareTodoList, this._getMethodLoader(UserController, 'shareTodoList'));
        app.post('/user/task', UserValidator.addUserTask, this._getMethodLoader(UserController, 'addUserTask'));
        app.put('/user/task', UserValidator.updateUserTask, this._getMethodLoader(UserController, 'updateUserTask'));
        // app.get('/product/mostviewed', TodoListValidator.getMostViewed, this._getMethodLoader(TodoListController, 'addTask'));
        // app.get('/product/:productId', TodoListValidator.getProduct, this._getMethodLoader(TodoListController, 'getProduct'));
        // app.delete('/product/:productId', TodoListValidator.deleteProduct, this._getMethodLoader(TodoListController, 'deleteProduct'));

        app.get('*', (req, res) => {
            res.send('Final fallback');
        });
    }
}

module.exports = new Routes();

class TodoListMapper {
    mapTodoList([todoTaskList, userTaskList]) {
        let output = {};

        const userTaskObject = this.getUserTask(userTaskList);
        todoTaskList.forEach(item => {
            if (output[item.todoListId]) {
                output[item.todoListId].task.push({...this.mapTask(item), userTask: userTaskObject[item.taskId] || []}) 
            } else {
                output[item.todoListId] = {
                    title: item.todoListTitle,
                    description: item.todoListDescription,
                    status: item.todoListStatus,
                    task: [{...this.mapTask(item), userTask: userTaskObject[item.taskId] || []}]
                }
            }
        });

        return output;
    }

    mapTask(params) {
        return {
            title: params.taskTitle,
            description: params.taskDescription,
            status: params.taskStatus,
            timeSpent: params.taskTimeSpent
        }
    }

    mapUserTask(params) {
        return {
            name: params.userName,
            status: params.userStatus,
            timeSpentOnTask: params.userTaskTimeSpent
        }
    }
    

    getUserTask(params) {
        let output = {};

        params.forEach(item => {
            if (output[item.taskId]) {
                output[item.taskId].push(this.mapUserTask(item));
            } else {
                output[item.taskId] = [this.mapUserTask(item)]
            }
        });

        return output;
    }
}

module.exports = new TodoListMapper();

##################################################
#
# Creates tables needed.
#
##################################################

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS todolist;

CREATE TABLE todolist(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS task;
CREATE TABLE task(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    todoListId INT NOT NULL,
    dueDateTime TIMESTAMP(3) NULL DEFAULT NULL,
    timeSpent INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY (title, todoListId),
    CONSTRAINT fkTodolistId FOREIGN KEY(todoListId) REFERENCES todolist(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

DROP TABLE IF EXISTS user;
CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
);
INSERT INTO user (name, email) VALUES ('Manash', 'manash@mailinator.com'), ('Reshma', 'reshma@mailinator.com'), ('Sanya', 'sanya@mailinator.com'), ('Deepak', 'deepak@mailinator.com'), ('Mrinal', 'mrinal@mailinator.com'), ('Zyan', 'zyan@mailinator.com'), ('Shannon', 'shannon@mailinator.com');

DROP TABLE IF EXISTS user_todolist;
CREATE TABLE user_todolist(
    id INT NOT NULL AUTO_INCREMENT,
    senderId INT NOT NULL,
    receipientId INT NOT NULL,
    todoListId INT NOT NULL,
    lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY (senderId, receipientId, todoListId),
    CONSTRAINT fkSenderId FOREIGN KEY(senderId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fkReceipientId FOREIGN KEY(receipientId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fkUserTodolistId FOREIGN KEY(todoListId) REFERENCES todolist(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

DROP TABLE IF EXISTS user_task;
CREATE TABLE user_task(
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    taskId INT NOT NULL,
    startTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
    endTime TIMESTAMP(3) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(3),
    task_status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
    timeSpent INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fkuserId FOREIGN KEY(userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fkTaskId FOREIGN KEY(taskId) REFERENCES task(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);
SET FOREIGN_KEY_CHECKS = 1;

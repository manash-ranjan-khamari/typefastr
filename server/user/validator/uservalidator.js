const {body, param, query, validationResult} = require('express-validator');


const integerIdValidation = (fieldName) => [
    body(fieldName)
    .isInt()
    .withMessage('must be an integer value')
];

const booleanValidation = (fieldName) => {

}

const shareTodoListValidationRule = [...integerIdValidation('senderId'), ...integerIdValidation('receipientId'), ...integerIdValidation('todoListId')];
const addUserTaskValidationRule = [...integerIdValidation('userId'), ...integerIdValidation('taskId')];
const updateUserTaskValidationRule = [...integerIdValidation('id')];

const validator = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => {
            return {
                field: error.param,
                message: error.msg
            };
        });
        
        return res.status(400).json({
            errors: errorMessages
        });
    }
    
    next();
}

module.exports = {
    shareTodoList: [
        shareTodoListValidationRule,
        validator
    ],
    addUserTask: [
        addUserTaskValidationRule,
        validator
    ],
    updateUserTask: [
        updateUserTaskValidationRule,
        validator
    ]/*,
    deleteProduct: [
        deleteProductValidationRule,
        validator
    ]*/
};

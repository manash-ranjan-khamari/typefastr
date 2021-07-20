const {body, param, query, validationResult} = require('express-validator');

const titleValidation = [
    body('title')
    .trim()
    .isLength({min: 2, max: 200})
    .withMessage('must be at least 2 chars & at max 200 chars')
];
const descriptionValidation = [
    body('description')
    .trim()
    .optional()
    .isLength({min: 20, max: 500})
    .withMessage('must be at least 20 chars & at max 500 chars')
];
const todoListIdValidation = [
    body('todoListId')
    .isInt()
    .withMessage('must be an integer value')
];
const idValidation = [
    query('id')
    .optional()
    .isInt()
    .withMessage('must be an integer value')
];
const dueDateTimeValidation = [
    body('dueDateTime')
    .trim()
    .optional()
    .isISO8601('yyyy-mm-dd')
    .matches(/(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('must be a valid datetime in the format YYYY-MM-DD HH:MM')
];

const addTodoListValidationRule = [...titleValidation, ...descriptionValidation];
const addTaskValidationRule = [...titleValidation, ...descriptionValidation, ...todoListIdValidation, ...dueDateTimeValidation];
const getTodoListValidationRule = [...idValidation];
// const getProductValidationRule = [...productIdValidation, ...currencyValidation];
// const deleteProductValidationRule = [...productIdValidation];

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
    addTodoList: [
        addTodoListValidationRule,
        validator
    ],
    addTask: [
        addTaskValidationRule,
        validator
    ],
    getTodoList: [
        getTodoListValidationRule,
        validator
    ]/*,
    deleteProduct: [
        deleteProductValidationRule,
        validator
    ]*/
};

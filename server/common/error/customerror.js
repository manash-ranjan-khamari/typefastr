class CustomError extends Error {
    constructor({status, message}) {
        super(message);
        this.name = "ValidationError";
        this.status = status;
    }
}

module.exports = CustomError;

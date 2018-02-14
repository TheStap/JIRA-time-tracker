class Exception extends Error {
    constructor(statusCode, message) {
        super(message);
        this._statusCode = statusCode;
    }

    get statusCode() {
        return this._statusCode;
    }
}

class ValidationException extends Exception {

    constructor(validationErrors) {
        super(422, 'Wrong data');
        this.validationErrors = validationErrors;
    }
}


const exceptionHandler = (err, req, res, next) => {
    let body;
    let status;

    if (err instanceof ValidationException) {
        body = {message: err.message, validationErrors: err.validationErrors};
        status = err.statusCode;
    }
    else if (err instanceof Exception) {
        body = {message: 'Error', error: err.message};
        status = err.statusCode;
    }
    else {
        body = {message: 'Server Error', error: err.message};
        status = 500;
    }
    res.status(status).send(body);
};

module.exports = {
    ValidationException,
    Exception,
    exceptionHandler
}


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
        super(422, 'Некорректные данные');
        this.validationErrors = validationErrors;
    }
}


const exceptionHandler = (err, req, res, next) => {
    if (err instanceof ValidationException) {
        res.body = err.validationErrors;
        res.status = err.statusCode;
    }
    else if (err instanceof Exception) {
        res.body = err.message;
        res.status = err.statusCode;
    }
    else {
        res.body = {message: 'Ошибка сервера', error: err};
        res.status = 500;
    }
    res.send();
}

exports.ValidationException = ValidationException;
exports.Exception = Exception;


function httpError(message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
};

exports.createBadRequestError = function(){
    return httpError('Invalid request data', 400);
};

exports.createUnprocessableEntityError = function(message){
    return httpError(message,422);
};
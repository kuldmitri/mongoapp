function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

exports.createBadRequestError = function() {
  return httpError('Invalid request data', 400);
};

exports.createUnprocessableEntityError = function(message) {
  return httpError(message, 422);
};

exports.createNotFoundNumberError = function(number) {
  return httpError(`Not Found number ${number}`, 421);
};

exports.NotFoundId = function(id) {
  return httpError(`Id ${id}not found`, 423);
};

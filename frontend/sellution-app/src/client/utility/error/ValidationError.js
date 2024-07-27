export function ValidationError(message) {
  const error = new Error(message);
  error.name = 'ValidationError';
  Object.setPrototypeOf(error, ValidationError.prototype);
  return error;
}

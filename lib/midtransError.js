// ref: https://rclayton.silvrback.com/custom-errors-in-node-js

/**
 * Custom HTTP Error Class that also expose httpStatusCode, ApiResponse, rawHttpClientData
 * To expose more info for lib user
 */
export class MidtransError extends Error {
  /**
   * @param {string} message
   * @param {number} [httpStatusCode = null]
   * @param {unknown} [ApiResponse = null]
   * @param {unknown} [rawHttpClientData = null]
   * @constructor
   * */
  constructor(
    message,
    httpStatusCode = null,
    ApiResponse = null,
    rawHttpClientData = null
  ) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    this.httpStatusCode = httpStatusCode;
    this.ApiResponse = ApiResponse;
    this.rawHttpClientData = rawHttpClientData;
    // This clips the constructor invocation from the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

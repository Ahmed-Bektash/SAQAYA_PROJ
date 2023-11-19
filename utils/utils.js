
export  const ErrorTypes = {
    BAD_REQ: 400,
    NOT_AUTHENTICATED: 401,
    UNAUTHORISED: 403,
    RESOURCE_NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    WRONG_DATA: 300,
    USER_EXISTS: 301,
    DB_ERROR: 302,

}

export class ErrorResponse extends Error {
    type;
  
    constructor(message, type) {
      super(message);
      this.type = type;
    }
  }
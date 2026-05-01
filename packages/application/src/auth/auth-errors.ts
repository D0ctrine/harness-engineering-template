export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthValidationError";
  }
}

export class AuthUnauthorizedError extends Error {
  constructor(message = "Authentication is required") {
    super(message);
    this.name = "AuthUnauthorizedError";
  }
}

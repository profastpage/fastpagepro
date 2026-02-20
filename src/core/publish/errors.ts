export class PublishInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublishInputValidationError";
  }
}


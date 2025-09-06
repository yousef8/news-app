class CustomError extends Error {
  status: number;
  
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export default CustomError;

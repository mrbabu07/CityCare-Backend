export class AppError extends Error {
    statusCode: number;
    errors: unknwon[];

    constructor(message: string, statusCode = 400, errors: unknwon[]= []){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype)
    }
}
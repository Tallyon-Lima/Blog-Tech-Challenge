export class InvalidCredentialsError extends Error {
    constructor() {
        super('username or password is incorrect');
    }
}
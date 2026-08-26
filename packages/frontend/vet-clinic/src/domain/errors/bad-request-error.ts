import { AbstractError } from '@/domain/errors/abstract.js';

export class BadRequestError extends AbstractError {
    public readonly code = 400;
    constructor(message = 'Bad request') {
        super(message);
    }
}

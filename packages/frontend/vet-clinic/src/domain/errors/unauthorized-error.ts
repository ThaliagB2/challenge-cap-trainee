import { AbstractError } from '@/domain/errors/abstract.js';

export class UnauthorizedError extends AbstractError {
    public readonly code = 401;
    constructor(message = 'Unauthorized') {
        super(message);
    }
}

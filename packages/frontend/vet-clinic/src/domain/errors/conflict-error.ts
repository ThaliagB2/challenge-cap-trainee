import { AbstractError } from '@/domain/errors/abstract.js';

export class ConflictError extends AbstractError {
    public readonly code = 409;
    constructor(message = 'Conflict') {
        super(message);
    }
}

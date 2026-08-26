import { AbstractError } from '@/domain/errors/abstract.js';

export class ForbiddenError extends AbstractError {
    public readonly code = 403;
    constructor(message = 'Forbidden') {
        super(message);
    }
}

import { AbstractError } from '@/domain/errors/abstract.js';

export class NotFoundError extends AbstractError {
    public readonly code = 404;
    constructor(message = 'Not found') {
        super(message);
    }
}

import { AbstractError } from '@/domain/errors/abstract.js';

export class ServerError extends AbstractError {
    public readonly code = 500;
    constructor(message = 'Internal server error') {
        super(message);
    }
}

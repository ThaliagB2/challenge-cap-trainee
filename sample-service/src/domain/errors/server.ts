import { AbstractError } from '@/domain/errors';

export class ServerError extends AbstractError {
    constructor(stack: string, message = 'internalServerError') {
        super(message, 500, stack);
    }
}

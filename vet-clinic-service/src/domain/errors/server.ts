import { AbstractError } from '@/domain/errors';

export class ServerError extends AbstractError {
    constructor(stack?: string, key = 'server.internal') {
        super(key, 500, undefined, stack);
    }
}

import { AbstractError } from '@/domain/errors';

export class BadRequestError extends AbstractError {
    constructor(key: string, args?: (number | string)[], stack?: string) {
        super(key, 400, args, stack);
    }
}

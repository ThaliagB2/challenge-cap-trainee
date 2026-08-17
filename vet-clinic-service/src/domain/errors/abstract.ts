export class AbstractError extends Error {
    public code: number;
    public key: string;
    public args?: (number | string)[];

    constructor(key: string, errorCode: number, args?: (number | string)[], stack?: string) {
        super(key);
        this.code = errorCode;
        this.key = key;
        this.args = args;
        this.stack = stack;
    }

    public toErrorDetails(targetField: string = 'unknown') {
        return [
            {
                status: this.code,
                message: this.message,
                target: targetField
            }
        ];
    }
}

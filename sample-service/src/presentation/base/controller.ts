export type BaseControllerResponse = {
    status: number;
    data?: any;
    errorData?: ErrorData;
};

export type ErrorData = {
    code: string;
    details: ErrorDetails[];
};

export type ErrorDetails = {
    status: number;
    message: string;
    target: string;
};

interface BaseController {
    success(data: any): BaseControllerResponse;
    error(code: number, details: ErrorDetails[]): BaseControllerResponse;
}

export class BaseControllerImpl implements BaseController {
    public success(data: any): BaseControllerResponse {
        return {
            data,
            status: 200
        };
    }

    public error(code: number, details: ErrorDetails[]): BaseControllerResponse {
        return {
            status: code,
            errorData: {
                code: 'MULTIPLE_ERRORS',
                details
            }
        };
    }
}

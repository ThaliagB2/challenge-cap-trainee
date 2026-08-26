import type { AbstractError } from '@/domain/errors/abstract.js';
import { BadRequestError } from '@/domain/errors/bad-request-error.js';
import { ConflictError } from '@/domain/errors/conflict-error.js';
import { ForbiddenError } from '@/domain/errors/forbidden-error.js';
import { NotFoundError } from '@/domain/errors/not-found-error.js';
import { ServerError } from '@/domain/errors/server-error.js';
import { UnauthorizedError } from '@/domain/errors/unauthorized-error.js';
import type { HttpClient } from '@/domain/protocols/http-client.js';

export class FetchHttpClient implements HttpClient {
    public async request<T>(params: HttpClient.Request): Promise<HttpClient.Response<T>> {
        let response: Response;

        try {
            response = await fetch(params.url, {
                method: params.method,
                headers: { 'Content-Type': 'application/json', ...params.headers },
                body: params.body ? JSON.stringify(params.body) : undefined
            });
        } catch {
            throw new ServerError('Erro ao conectar com o servidor');
        }

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            throw this.mapError(response.status, body);
        }

        return { statusCode: response.status, body: body as T };
    }

    private mapError(status: number, body: unknown): AbstractError {
        const message = this.extractMessage(body);
        switch (status) {
            case 400: return new BadRequestError(message);
            case 401: return new UnauthorizedError(message);
            case 403: return new ForbiddenError(message);
            case 404: return new NotFoundError(message);
            case 409: return new ConflictError(message);
            default: return new ServerError(message);
        }
    }

    private extractMessage(body: unknown): string | undefined {
        if (body && typeof body === 'object') {
            const err = (body as Record<string, unknown>).error;
            if (err && typeof err === 'object') {
                const msg = (err as Record<string, unknown>).message;
                return typeof msg === 'string' ? msg : undefined;
            }
        }
        return undefined;
    }
}

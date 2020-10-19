import { Request } from 'express';
import { isNullOrUndefined, isArray } from '@util/core.util';

export class RequestHelper {
    public static GetHeader(request: Request, name: string): string | undefined {
        const headerValue: string | string[] | undefined = request.headers[name];
        if (isNullOrUndefined(headerValue)) {
            return undefined;
        } else if (isArray(headerValue)) {
            return headerValue && headerValue[0];
        } else {
            return headerValue?.toString();
        }
    }
}

import { Response } from 'express';

export default class ResponseHelper {
    public static WriteError(response: Response, exception: any): void {
        if (exception.statusCode) {
            response.status(exception.statusCode);
        } else if (exception.body && exception.body.indexOf('NotFound') !== -1) {
            response.status(404);
        } else {
            response.setHeader("Content-Type", "application/json");
            response.status(500).send(exception.body || JSON.stringify({ exception: exception.message }));
        }
    }

    public static WriteStatus(response: Response, status: number, reason: string): void {
        response.setHeader("Content-Type", "application/json");
        response.status(status).send(JSON.stringify({ status: status, reason: reason }));
    }

    public static WriteResult(response: Response, result: any): void {
        response.setHeader("Content-Type", "application/json");
        response.send(JSON.stringify(result));
    }

    public static WriteHTML(response: Response, result: any): void {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(JSON.stringify(result));
    }
}

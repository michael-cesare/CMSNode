import { Response } from 'express'
import { IError } from '@srcTypes/models'
import { EErrorsCodes } from '@srcTypes/enums'
import { isEmpty } from '@util/core.util'

export default class ResponseHelper {
    public static WriteError(response: Response, exception: any): void {
        if (typeof exception === 'string') {
            const error: IError = {
                code: EErrorsCodes.SomethingWentWrong,
                info: exception,
            }
            response.setHeader("Content-Type", "application/json")
            response.status(500).send(JSON.stringify(error))
        } else if (exception.statusCode) {
            response.status(exception.statusCode)
        } else if (exception.body && exception.body.indexOf('NotFound') !== -1) {
            response.status(404)
        } else {
            response.setHeader("Content-Type", "application/json")
            response.status(500).send(exception.body || JSON.stringify({ exception: exception.message }))
        }
    }

    public static WriteStatus(response: Response, status: number, reason: string): void {
        response.setHeader("Content-Type", "application/json")
        response.status(status).send(JSON.stringify({ status: status, reason: reason }))
    }

    public static WriteResult(response: Response, result: any): void {
        const jsonResult = isEmpty(result) ? '' : JSON.stringify(result)
        response.setHeader("Content-Type", "application/json")
        response.send(jsonResult)
    }

    public static WriteHTML(response: Response, result: any): void {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write(JSON.stringify(result))
    }
}

import express from 'express'
import { API_NAMESPACE } from "@config/envConfig"
import apiRoutes from '../api'
import webRoutes from '../web'

export default async ({ app }: { app: express.Application }) => {
  // Check app status
  app.get('/status', (req:any, res:any) => {
    res.status(200).end()
  })

  app.head('/status', (req:any, res:any) => {
    res.status(200).end()
  })

  // Register routes for API, WEB, Sockets
  app.use(`/${API_NAMESPACE()}`, apiRoutes());
  // app.use(`/${SOCKET_NAMESPACE()}`, socketRoutes());
  app.use('/', webRoutes());

  // 404 Error handler
  app.use((req:any, res:any, next:any) => {
    const err: any = new Error('Not Found')
    err['status'] = 404
    next(err)
  })

  // Error Catcher
  app.use((err:any, req:any, res:any, next:any) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message,
      },
    })
  })
}

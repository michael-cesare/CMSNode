import { Router } from 'express'
import { favIconRoute } from '@webControllers/favIconMiddleware';
import pingController from '@webControllers/pingController';

export default (): Router => {
  const webApp = Router()

  // Web API Handling
  webApp.use(favIconRoute)
  pingController(webApp)

  return webApp
}

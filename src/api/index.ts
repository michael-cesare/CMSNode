import { Router } from 'express'
import wordpressController from '@controllers/wordpressController';

export default (): Router => {
  const apiApp = Router()

  // REST API Handling
  wordpressController(apiApp)

  return apiApp
}

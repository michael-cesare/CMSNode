import expressLoader from './express'
import logger from '@util/logger.util';

export default async ({ expressApp }: any) => {

  await expressLoader({ app: expressApp })
  logger.info('[Express] started')
}

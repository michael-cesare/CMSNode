import path from 'path'
import { IS_SRC } from "@config/envConfig"

const artifactsLocation = IS_SRC() ? 'src' : 'dist'

export const pathResolve = ( location:string ) => path.resolve( `/${artifactsLocation}`, __dirname, `../${location}` )

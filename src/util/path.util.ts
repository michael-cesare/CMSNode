import path from 'path';

export const pathResolve = ( location:string ) => path.resolve( '/dist', __dirname, `../${location}` );

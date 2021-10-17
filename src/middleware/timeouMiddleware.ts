import { Response, Request } from 'express';

const apiTimeout = 5 * 100000;

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const timeouMiddleware = (fn: any) => (req:Request, res:Response, next:any) => {
  req.setTimeout(apiTimeout, () => {
    const err: any = new Error('Request Timeout');
    err.status = 408;
    next(err);
  });

  Promise.resolve(fn(req, res, next))
    .catch(next);
};

export default timeouMiddleware;

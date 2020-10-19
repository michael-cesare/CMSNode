const favIconRoute = async (req:any, res:any, next:any) => {
  if(req.url=="/favicon.ico") {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();

    return;
  } else {
    next();
  }
};

export { favIconRoute };

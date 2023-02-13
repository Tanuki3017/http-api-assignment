const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': htmlHandler.success,
  '/badRequest': htmlHandler.badRequest,
  '/unauthorized': htmlHandler.unauthorized,
  '/forbidden': htmlHandler.forbidden,
  '/internal': htmlHandler.internal,
  '/notImplemented': htmlHandler.notImplemented,
  '/notFound': htmlHandler.notFound,
  notFound: htmlHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  let acceptedTypes = request.headers.accept.split(',');

  // If one wasn't specified from the html file
  if (acceptedTypes.length > 1) {
    acceptedTypes = ['application/json'];
  }

  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

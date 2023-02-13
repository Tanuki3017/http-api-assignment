const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  console.log(content);
  response.write(content);
  response.end();
};

// I only need one method to make it either object
const xmlOrJSON = (request, response, status, responseGeneric, type) => {
  if (type[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <id>${responseGeneric.id}</id>`;
    responseXML = `${responseXML} <message>${responseGeneric.message}</message>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, status, responseXML, type);
  }

  const responseString = JSON.stringify(responseGeneric);

  return respond(request, response, status, responseString, type);
};

const success = (request, response, type) => {
  const responseGeneric = {
    id: 'Success',
    message: 'Request successful',
  };

  xmlOrJSON(request, response, 200, responseGeneric, type);
};

const badRequest = (request, response, type, params) => {
  if (params.valid === 'true') {
    success(request, response, type);
  } else {
    const responseGeneric = {
      id: 'Bad Request',
      message: 'Missing "valid" parameter',
    };

    xmlOrJSON(request, response, 400, responseGeneric, type);
  }
};

const unauthorized = (request, response, type, params) => {
  if (params.loggedIn === 'true') {
    success(request, response, type);
  } else {
    const responseGeneric = {
      id: 'Unauthorized',
      message: 'User not logged in',
    };

    xmlOrJSON(request, response, 401, responseGeneric, type);
  }
};

const forbidden = (request, response, type) => {
  const responseGeneric = {
    id: 'Forbidden',
    message: 'Account does not have access',
  };

  xmlOrJSON(request, response, 403, responseGeneric, type);
};

const internal = (request, response, type) => {
  const responseGeneric = {
    id: 'Server Error',
    message: 'Internal server error',
  };

  xmlOrJSON(request, response, 500, responseGeneric, type);
};

const notImplemented = (request, response, type) => {
  const responseGeneric = {
    id: 'Not Implemented',
    message: 'Request has not been implemented',
  };

  xmlOrJSON(request, response, 501, responseGeneric, type);
};

const notFound = (request, response, type) => {
  const responseGeneric = {
    id: 'Error 404: Page not Found',
    message: 'Unable to locate requested page',
  };

  xmlOrJSON(request, response, 404, responseGeneric, type);
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};

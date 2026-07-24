import morgan from 'morgan';

// Log method, route, status code, response time, and content length
export const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms');

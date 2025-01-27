import morgan from 'morgan';
import { logger } from './logger';

// Create a Morgan stream that uses the Winston logger
const morganMiddleware = morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()), // Log info messages
  },
});

export default morganMiddleware;

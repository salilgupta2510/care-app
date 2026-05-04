import { logger } from 'firebase-functions/v2';

export function logInfo(message: string, data?: object) {
  logger.info(message, data);
}

export function logError(message: string, error: unknown) {
  logger.error(message, { error: error instanceof Error ? error.message : String(error) });
}

export function logWarn(message: string, data?: object) {
  logger.warn(message, data);
}

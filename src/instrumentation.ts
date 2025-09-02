// src/instrumentation.ts
import * as Sentry from '@sentry/nextjs';

export async function onRequestError(request: Request, error: Error, context: unknown) {
  Sentry.captureException(error, {
    tags: {
      type: 'request_error',
      url: request.url,
    },
    extra: {
      context,
    },
  });
}

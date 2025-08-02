import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { capitalize } from 'lodash';

export const initializeSentry = (allowLogs = false) => {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return null;
  }

  try {
    Sentry.init({
      initialScope: {
        tags: {
          service: 'OpenAI',
          component: 'nestjs',
        },
        contexts: {
          app: {
            name: `Postiz OpenAI`,
          },
        },
      },
      environment: process.env.NODE_ENV || 'development',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        // Add our Profiling integration
        nodeProfilingIntegration(),
        Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
        Sentry.vercelAIIntegration(),
      ],
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.3,
      enableLogs: true,
    });
  } catch (err) {
    console.log(err);
  }
  return true;
};

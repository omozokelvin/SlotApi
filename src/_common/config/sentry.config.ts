import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function sentryConfig() {
  return {
    environment: process.env.NODE_ENV,
    dsn: 'https://109c2a550c8d9523acacc729f6837151@o4507649509949440.ingest.us.sentry.io/4508262440435712',
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  };
}

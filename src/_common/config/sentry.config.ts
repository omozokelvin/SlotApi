import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function sentryConfig() {
  return {
    environment: process.env.NODE_ENV,
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  };
}

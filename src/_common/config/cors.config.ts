import { EnvironmentEnum } from '@/_common/enums/environment.enum';

function getAllowedOrigins() {
  const environment = process.env.NODE_ENV as EnvironmentEnum;

  const flutterwaveIPs = ['34.251.99.7'];

  const allowed = [
    'https://slot.ng',
    // all subdomains of slot
    new RegExp(`https://.*.slot\.ng`),
    // any specific ips we want i.e flutterwave
    ...flutterwaveIPs,
  ];

  // when it's not production, we push in localhost
  if (environment !== EnvironmentEnum.prod) {
    allowed.push(new RegExp(`http://localhost:.*`));
  }

  return allowed;
}

export function setupCors(app) {
  app.enableCors({
    origin: getAllowedOrigins(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
}

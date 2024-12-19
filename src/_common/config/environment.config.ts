import { appProps } from '@/_common/config/app-props.constant';
import { EnvironmentEnum } from '@/_common/enums/environment.enum';

export function isProd() {
  return process.env.NODE_ENV === EnvironmentEnum.prod;
}

export function isTesting() {
  return process.env.NODE_ENV === EnvironmentEnum.testing;
}

export function isInAws() {
  return isProd();
}

export function isDev() {
  return process.env.NODE_ENV === EnvironmentEnum.dev;
}

export function awsConfig() {
  if (isInAws()) {
    return {
      region: appProps().region,
    };
  }

  const accessKeyId = process.env.ACCESS_KEY_AWS;
  const secretAccessKey = process.env.SECRET_KEY_AWS;

  return {
    region: appProps().region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };
}

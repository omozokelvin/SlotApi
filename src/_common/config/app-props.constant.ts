import { EnvironmentEnum } from '@/_common/enums/environment.enum';

export function appProps() {
  return {
    name: `Slot`,
    description: `Slot is a platform that allows you to buy and sell quality electronics and devices.`,
    version: '1.0',
    logo: 'https://slot.ng/media/wysiwyg/logo-icon-3_1_1_.png',
    address: `Lagos, Nigeria`,
    logoLight: 'https://slot.ng/media/wysiwyg/logo-icon-3_1_1_.png',
    playStoreLink: '',
    appleStoreLink: '',
    currentYear: new Date().getFullYear(),
    unsubscribeUrl: '',
    helpCenterUrl: '',
    otpExpirationSeconds: 600, // 10 minutes
    baseUrl:
      process.env.NODE_ENV === EnvironmentEnum.prod
        ? 'https://api.slot.ng'
        : process.env.NODE_ENV === EnvironmentEnum.testing
          ? 'https://testing.api.slot.ng'
          : `http://localhost:${process.env.PORT}`,
    authClientUrl:
      process.env.NODE_ENV === EnvironmentEnum.prod
        ? 'https://auth.slot.ng'
        : process.env.NODE_ENV === EnvironmentEnum.testing
          ? 'https://testing.auth.slot.ng'
          : 'http://localhost:8081',
    accessTokenTll: 2 * 60 * 60, // 2 hours and it's currently in seconds,
    refreshTokenTll: 30 * 24 * 60 * 60, // 30 days
    region: 'us-east-1',
    adminEmail: process.env.ADMIN_EMAIL,
    supportEmail: process.env.SUPPORT_EMAIL,
  };
}

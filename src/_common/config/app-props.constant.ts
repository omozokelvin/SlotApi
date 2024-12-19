import { EnvironmentEnum } from '@/_common/enums/environment.enum';

export function appProps() {
  return {
    name: `Slot`,
    description: `Slot is a platform that allows you to buy and sell quality electronics and devices.`,
    version: '1.0',
    logo: 'https://res.cloudinary.com/darkel/image/upload/v1732523593/carremindernigeria/icon_pss217.png',
    address: `Lagos, Nigeria`,
    logoLight:
      'https://res.cloudinary.com/darkel/image/upload/v1732523593/carremindernigeria/icon_pss217.png',
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
          : 'http://localhost:4000',
    authClientUrl:
      process.env.NODE_ENV === EnvironmentEnum.prod
        ? 'https://auth.slot.ng'
        : process.env.NODE_ENV === EnvironmentEnum.testing
          ? 'https://testing.auth.slot.ng'
          : 'http://localhost:8081',
    accessTokenTll: 2 * 60 * 60, // 2 hours and it's currently in seconds,
    refreshTokenTll: 30 * 24 * 60 * 60, // 30 days
    region: 'us-east-1',
    adminEmail: 'admin@slot.ng',
    supportEmail: 'support@slot.ng',
  };
}

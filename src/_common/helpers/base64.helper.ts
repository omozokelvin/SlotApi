export const encodeBase64 = <T>(payload: T): string => {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const decodeBase64 = <T>(base64: string): T => {
  const decoded = Buffer.from(base64, 'base64').toString('ascii');

  return JSON.parse(decoded);
};

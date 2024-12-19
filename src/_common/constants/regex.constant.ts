export const OTP_REGEX = '^[0-9]{6}$';
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?:.*[^\w\s])?[a-zA-Z\d!@#$%^&*+\-.,:;<>{}=|\\/()__+"'?~]{8,}$/;
export const SUB_DOMAIN_REGEX = /^[a-zA-Z0-9-]+$/;
export const AMBIGUOUS_CHARACTERS_REGEX = /[IiLlOo10\s]/g;

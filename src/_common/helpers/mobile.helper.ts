import parsePhoneNumber, {
  CountryCode,
  isValidPhoneNumber,
} from 'libphonenumber-js/mobile';

// we should deprecate this and rely fully on DTO
export const getInternationalPhoneNumber = (
  phoneNumber: string,
  countryCode: CountryCode = 'NG',
): string => {
  if (!validMobileNumber(phoneNumber, countryCode)) {
    return '';
  }

  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumber.toString(),
    countryCode,
  );

  return `${parsedPhoneNumber?.countryCallingCode}${parsedPhoneNumber?.nationalNumber}`;
};

export const validMobileNumber = (
  value: string,
  countryCode: CountryCode = 'NG',
) => {
  return isValidPhoneNumber(value.toString(), countryCode);
};

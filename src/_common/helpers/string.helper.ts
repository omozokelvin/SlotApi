export const sentenceCase = (sentence: string) => {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

export const titleCase = (sentence: string) => {
  return sentence
    .split(' ')
    .map((word) => sentenceCase(word))
    .join(' ');
};

export const maskEmailAddress = (emailAddress: string) => {
  if (!emailAddress) {
    return '';
  }

  const [firstPart, lastPart] = emailAddress.split('@');

  const nChar = firstPart.length > 3 ? 3 : firstPart.length - 1;

  const firstNChars = firstPart.substring(0, nChar);

  const lastChar = firstPart.charAt(firstPart.length - 1);

  const numberOfAsterisks = firstPart.length - firstNChars.length - 1;

  const asterisks = '*'.repeat(numberOfAsterisks);

  return `${firstNChars + asterisks + lastChar + '@' + lastPart}`;
};

export const maskPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return '';
  }

  const total = phoneNumber.length;
  const nChar = 6;
  const lastNChar = 3;
  const toBeMasked = total - nChar - lastNChar;
  const asterisks = '*'.repeat(toBeMasked);

  return (
    phoneNumber.substring(0, nChar) +
    asterisks +
    phoneNumber.substr(total - lastNChar)
  );
};

export const generateRandomNumbers = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const generateRandomStrings = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let seed = '';
  for (let i = 0; i < length; i++) {
    seed += characters[Math.floor(Math.random() * 10)];
  }
  return seed;
};

export const camelCaseToReadable = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
    .replace(/^./, (firstChar) => firstChar.toUpperCase()); // Capitalize the first letter
};

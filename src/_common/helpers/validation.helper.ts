import { isURL } from 'class-validator';

export function validateUrl() {
  return {
    validator: (v: string) => {
      if (!v) {
        return true;
      }

      return isURL(v);
    },
    message: 'Logo must be a valid URL',
  };
}

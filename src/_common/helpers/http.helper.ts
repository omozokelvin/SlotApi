import { throwError } from 'rxjs';

export const handleAxiosError = (error) => {
  const errorMessage = error?.response?.data || error?.response || error;

  return throwError(() => errorMessage);
};

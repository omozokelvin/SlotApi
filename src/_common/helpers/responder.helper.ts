import { ApiResponse } from '@/_common/dtos/response.dto';

export const responder = {
  success: <T = undefined>(
    message: string,
    data: T = undefined,
  ): ApiResponse<T> => {
    return {
      message,
      data,
    };
  },
};

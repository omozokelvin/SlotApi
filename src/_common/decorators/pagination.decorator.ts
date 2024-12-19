import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const PaginatedModel = (model) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 100 },
              page: { type: 'integer', example: 1 },
              lastPage: { type: 'integer', example: 2 },
              hasNextPage: { type: 'boolean', example: true },
              hasPreviousPage: { type: 'boolean', example: false },
              limit: { type: 'integer', example: 50 },
            },
          },
        },
      },
    }),
  );
};

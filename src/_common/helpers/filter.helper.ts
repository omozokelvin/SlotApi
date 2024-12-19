import { PaginationMeta } from '@/_common/dtos/response.dto';
import { longDate } from '@/_common/helpers/date.helper';
import { camelCaseToReadable } from '@/_common/helpers/string.helper';
import { isNotEmptyObject } from 'class-validator';
import { endOfDay, startOfDay } from 'date-fns';
import {
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  SortOrder,
} from 'mongoose';

type PaginateAndSort<T> = {
  model: Model<any>;
  sort?: string;
  filters?: FilterQuery<T>;
  page?: number;
  limit?: number;
  projection?: ProjectionType<T> | null | undefined;
  options?: QueryOptions<T> | null | undefined;
  populate?: PopulateOptions | (PopulateOptions | string)[];
};

type AggregatePaginateAndSort<T> = {
  pipeline?: PipelineStage[];
} & Pick<PaginateAndSort<T>, 'model' | 'sort' | 'filters' | 'page' | 'limit'>;

export const dateRangeFilter = (minDate: Date, maxDate: Date, key: string) => {
  if (minDate && !maxDate) {
    return {
      [key]: {
        $gte: startOfDay(minDate),
      },
    };
  }

  if (maxDate && !minDate) {
    return {
      [key]: {
        $lte: endOfDay(maxDate),
      },
    };
  }

  if (minDate && maxDate) {
    return {
      [key]: {
        $gte: startOfDay(minDate),
        $lte: endOfDay(maxDate),
      },
    };
  }

  return {};
};

export const timeRangeFilter = (minDate: Date, maxDate: Date, key: string) => {
  if (minDate && !maxDate) {
    return {
      [key]: {
        $gte: minDate,
      },
      // $expr: {
      //   $and: [
      //     { $gte: [{ $hour: `$${key}` }, minDate.getHours() - 1] },
      //     { $gte: [{ $minute: `$${key}` }, minDate.getMinutes()] },
      //   ],
      // },
    };
  }

  if (maxDate && !minDate) {
    return {
      $expr: {
        $and: [
          { $lte: [{ $hour: `$${key}` }, maxDate.getHours() - 1] },
          { $lte: [{ $minute: `$${key}` }, maxDate.getMinutes()] },
        ],
      },
    };
  }

  if (minDate && maxDate) {
    return {
      $expr: {
        $and: [
          // MIN
          { $gte: [{ $hour: `$${key}` }, minDate.getHours() - 1] },
          { $gte: [{ $minute: `$${key}` }, minDate.getMinutes()] },

          // MAX
          { $lte: [{ $hour: `$${key}` }, maxDate.getHours() - 1] },
          { $lte: [{ $minute: `$${key}` }, maxDate.getMinutes()] },
        ],
      },
    };
  }

  return {};
};

export const numberRangeFilter = (min: number, max: number, key: string) => {
  if (min && !max) {
    return {
      [key]: {
        $gte: min,
      },
    };
  }

  if (max && !min) {
    return {
      [key]: {
        $lte: max,
      },
    };
  }

  if (min && max) {
    return {
      [key]: {
        $gte: min,
        $lte: max,
      },
    };
  }

  return {};
};

export const transformDoc = <T>(doc: T): T => {
  if (!doc) {
    return null;
  }

  if ((doc as any)?.isDeleted) {
    return null;
  }

  delete (doc as any).isDeleted;

  if ((doc as any)?._id) {
    (doc as any).id = (doc as any)?._id?.toString();
    delete (doc as any)._id;
  }

  return doc;
};

export const paginateAndSort = async <T>(params: PaginateAndSort<T>) => {
  const {
    model,
    sort = 'createdAt,desc',
    filters = {},
    page = 1,
    limit = 50,
    projection = null,
    options = null,
    populate = null,
  } = params;

  const query = model.find(filters, projection, options);

  if (populate) {
    query.populate(populate);
  }

  if (sort) {
    const [columnName, order] = sort.split(',');

    query.sort({
      [columnName]: order as SortOrder,
    });
  }

  const dataPromise = query
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const totalPromise = model.countDocuments(filters);

  return Promise.all([dataPromise, totalPromise]).then(([data, total]) => {
    const lastPage = Math.ceil(total / limit);
    const hasNextPage = page < lastPage;
    const hasPreviousPage = page > 1;

    const meta: PaginationMeta = {
      total,
      page,
      lastPage,
      hasNextPage,
      hasPreviousPage,
      limit,
    };

    return {
      data: data.map(transformDoc) as T[],
      meta,
    };
  });
};

export const aggregatePaginateAndSort = async <T>(
  params: AggregatePaginateAndSort<T>,
) => {
  const {
    model,
    pipeline = [],
    sort = '',
    filters = {},
    page = 1,
    limit = 10,
  } = params;

  if (isNotEmptyObject(filters)) {
    pipeline.push({
      $match: filters,
    });
  }

  if (sort) {
    const [columnName, order] = sort.split(',');

    pipeline.push({
      $sort: {
        [columnName]: order === 'asc' ? 1 : -1,
      },
    });
  }

  if (page) {
    pipeline.push({
      $skip: (page - 1) * limit,
    });
  }

  if (limit) {
    pipeline.push({
      $limit: limit,
    });
  }

  const dataPromise = model.aggregate(pipeline);

  const countPipeline = [...pipeline]; // copy the pipeline
  countPipeline.push({ $count: 'total' });

  const totalPromise = model.aggregate(countPipeline);

  return Promise.all([dataPromise, totalPromise]).then(
    ([data, [totalResult]]) => {
      const total = totalResult ? totalResult.total : 0;
      const lastPage = Math.ceil(total / limit);
      const hasNextPage = page < lastPage;
      const hasPreviousPage = page > 1;

      const meta: PaginationMeta = {
        total,
        page,
        lastPage,
        hasNextPage,
        hasPreviousPage,
        limit,
      };

      return {
        data: data.map(transformDoc) as T[],
        meta,
      };
    },
  );
};

export const emptyObject = (obj: Record<string, any>) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const transformBoolean = () => {
  return ({ value }) => {
    const transformed = value?.toLowerCase();

    return ['true', 'false'].includes(transformed)
      ? transformed === 'true'
      : undefined;
  };
};

export const arraysEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

// Helper function to get the difference between two arrays
export const arrayDifference = (arr1: string[], arr2: string[]) => {
  return arr1.filter((item) => !arr2.includes(item));
};

export const transformRecordsForDownload = <T>(
  data: T[],
  keys: (keyof T)[],
) => {
  return data.map((item) => {
    const readableItem: Record<string, unknown> = {};

    for (const key of keys) {
      if (item.hasOwnProperty(key)) {
        if (['createdAt', 'updatedAt'].includes(key as string)) {
          item[key as string] = longDate(item[key as string]);
        }

        readableItem[camelCaseToReadable(key as string)] = item[key];
      }
    }

    return readableItem;
  });
};

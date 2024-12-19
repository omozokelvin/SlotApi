import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: unknown, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }
}

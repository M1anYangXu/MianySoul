import { LRUCache } from "lru-cache";
import { config } from "../config/index.js";

/**
 * 缓存接口 - 预留 Redis 适配
 */
export interface CacheInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

/**
 * 内存缓存实现 - 基于 LRU
 */
export class MemoryCache implements CacheInterface {
  private cache: LRUCache<string, unknown>;

  constructor() {
    this.cache = new LRUCache<string, unknown>({
      max: config.cache.maxItems,
      ttl: config.cache.maxAge,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    return value !== undefined ? (value as T) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, value, { ttl: ttl || config.cache.maxAge });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

/**
 * Redis 缓存实现 - 预留接口
 */
export class RedisCache implements CacheInterface {
  // TODO: 实现 Redis 连接
  // private client: Redis;

  async get<T>(_key: string): Promise<T | null> {
    throw new Error("Redis cache not implemented");
  }

  async set<T>(_key: string, _value: T, _ttl?: number): Promise<void> {
    throw new Error("Redis cache not implemented");
  }

  async del(_key: string): Promise<void> {
    throw new Error("Redis cache not implemented");
  }

  async has(_key: string): Promise<boolean> {
    throw new Error("Redis cache not implemented");
  }

  async clear(): Promise<void> {
    throw new Error("Redis cache not implemented");
  }
}

// 默认使用内存缓存
export const cache: CacheInterface = new MemoryCache();

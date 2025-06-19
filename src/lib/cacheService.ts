
import { get, set, del, clear } from 'idb-keyval';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    try {
      const item: CacheItem<T> = await get(key);
      if (!item) return null;

      if (Date.now() > item.expiresAt) {
        await del(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };
      await set(key, item);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Fabric-specific cache methods
  async getFabric(fabricId: string) {
    return this.get(`fabric:${fabricId}`);
  }

  async setFabric(fabricId: string, data: any) {
    return this.set(`fabric:${fabricId}`, data, 30 * 60 * 1000); // 30 minutes
  }

  async getSearchResults(query: string, filters: any) {
    const cacheKey = `search:${JSON.stringify({ query, filters })}`;
    return this.get(cacheKey);
  }

  async setSearchResults(query: string, filters: any, results: any) {
    const cacheKey = `search:${JSON.stringify({ query, filters })}`;
    return this.set(cacheKey, results, 10 * 60 * 1000); // 10 minutes
  }

  async getSupplier(supplierId: string) {
    return this.get(`supplier:${supplierId}`);
  }

  async setSupplier(supplierId: string, data: any) {
    return this.set(`supplier:${supplierId}`, data, 60 * 60 * 1000); // 1 hour
  }
}

export const cacheService = new CacheService();

import DataLoader from "dataloader";
import { Injectable } from "@nestjs/common";

// Generic DataLoader factory for batching database queries

@Injectable()
export class DataLoaderService {
  /**
   * Creates a generic DataLoader
   * @param batchLoadFn Function that loads data in batches
   * @param options Optional DataLoader options
   */
  createLoader<K, V>(
    batchLoadFn: DataLoader.BatchLoadFn<K, V>,
    options?: DataLoader.Options<K, V>
  ): DataLoader<K, V> {
    return new DataLoader<K, V>(batchLoadFn, options);
  }

  // Creates a loader for fetching entities by ID

  createIdLoader<T>(
    loadFn: (
      ids: readonly string[] | readonly number[]
    ) => Promise<(T | Error)[]>,
    options?: DataLoader.Options<string | number, T>
  ): DataLoader<string | number, T> {
    return new DataLoader<string | number, T>(async (ids) => {
      const results = await loadFn(ids as any);
      return ids.map((id) => {
        const result = results.find((r) =>
          r instanceof Error ? false : (r as any).id === id
        );
        return result || new Error(`Not found: ${id}`);
      });
    }, options);
  }
}

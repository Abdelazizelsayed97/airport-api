import DataLoader from "dataloader";
import { Injectable } from "@nestjs/common";

/**
 * Generic DataLoader factory for batching database queries
 */
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

  /**
   * Creates a loader for fetching entities by ID
   */
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

// ============================================
// Usage Examples
// ============================================

// 1. Basic ID Loader
// @Injectable()
// export class UserDataLoaderService {
//   constructor(private dataLoaderService: DataLoaderService) {}

//   getUserLoader(userRepository: UserRepository): DataLoader<string, User> {
//     return this.dataLoaderService.createIdLoader<User>(async (userIds) => {
//       return userRepository.findByIds(userIds as string[]);
//     });
//   }
// }

// // 2. Complex Batch Loader (with filtering, grouping, etc.)
// @Injectable()
// export class BookDataLoaderService {
//   constructor(private dataLoaderService: DataLoaderService) {}

//   getBooksByUserLoader(
//     bookRepository: BookRepository
//   ): DataLoader<string, Book[]> {
//     return this.dataLoaderService.createLoader<string, Book[]>(
//       async (userIds) => {
//         const books = await bookRepository.findByUserIds(userIds as string[]);

//         // Group books by userId
//         const booksMap = new Map<string, Book[]>();
//         userIds.forEach((userId) => {
//           booksMap.set(userId as string, []);
//         });

//         books.forEach((book) => {
//           const userBooks = booksMap.get(book.userId) || [];
//           userBooks.push(book);
//           booksMap.set(book.userId, userBooks);
//         });

//         return userIds.map((userId) => booksMap.get(userId as string) || []);
//       }
//     );
//   }

//   getBooksByIdLoader(bookRepository: BookRepository): DataLoader<string, Book> {
//     return this.dataLoaderService.createIdLoader<Book>(async (bookIds) => {
//       return bookRepository.findByIds(bookIds as string[]);
//     });
//   }
// }

// // 3. Context setup for GraphQL
// export interface DataLoaderContext {
//   userLoader: DataLoader<string, User>;
//   bookLoader: DataLoader<string, Book>;
//   booksByUserLoader: DataLoader<string, Book[]>;
// }

// @Injectable()
// export class DataLoaderContextService {
//   constructor(
//     private userDataLoaderService: UserDataLoaderService,
//     private bookDataLoaderService: BookDataLoaderService,
//     private userRepository: UserRepository,
//     private bookRepository: BookRepository
//   ) {}

//   createContext(): DataLoaderContext {
//     return {
//       userLoader: this.userDataLoaderService.getUserLoader(this.userRepository),
//       bookLoader: this.bookDataLoaderService.getBooksByIdLoader(
//         this.bookRepository
//       ),
//       booksByUserLoader: this.bookDataLoaderService.getBooksByUserLoader(
//         this.bookRepository
//       ),
//     };
//   }
// }

// // 4. GraphQL Module setup
// import { GraphQLModule } from "@nestjs/graphql";
// import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

// GraphQLModule.forRoot<ApolloDriverConfig>({
//   driver: ApolloDriver,
//   autoSchemaFile: true,
//   context: ({ req }) => {
//     // Create fresh DataLoader context for each request
//     const loaderContext = app.get(DataLoaderContextService).createContext();
//     return { ...loaderContext, req };
//   },
// });

// // 5. Using DataLoader in resolvers
// import { Resolver, Parent, ResolveField, Args, Context } from "@nestjs/graphql";

// @Resolver(() => User)
// export class UserResolver {
//   @ResolveField(() => [Book])
//   async bookingList(
//     @Parent() user: User,
//     @Context() context: DataLoaderContext
//   ): Promise<Book[]> {
//     // Batches requests automatically
//     return context.booksByUserLoader.load(user.id);
//   }
// }

// @Resolver(() => Book)
// export class BookResolver {
//   @ResolveField(() => User)
//   async user(
//     @Parent() book: Book,
//     @Context() context: DataLoaderContext
//   ): Promise<User> {
//     // Batches requests automatically
//     return context.userLoader.load(book.user.id);
//   }
// }

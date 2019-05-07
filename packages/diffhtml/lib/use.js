import { MiddlewareCache } from './util/caches';
import process from './util/process';

const { isArray } = Array;

const {
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache,
  ReleaseHookCache,
} = MiddlewareCache;

export default function use(middleware) {
  const isFunction = typeof middleware === 'function';
  const isObject = typeof middleware === 'object';

  if (process.env.NODE_ENV !== 'production') {
    if (!middleware || (!isFunction && !isObject) || isArray(middleware)) {
      throw new Error('Middleware must be a function or plain object');
    }
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook,
    releaseHook,
  } = middleware;

  // Add the function to the set of middlewares.
  isFunction && MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe();

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);
  releaseHook && ReleaseHookCache.add(releaseHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    isFunction && MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe();

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache.delete(createTreeHook);
    CreateNodeHookCache.delete(createNodeHook);
    SyncTreeHookCache.delete(syncTreeHook);
    ReleaseHookCache.delete(releaseHook);
  };
}

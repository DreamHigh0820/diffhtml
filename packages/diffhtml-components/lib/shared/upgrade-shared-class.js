import { use } from 'diffhtml';
import lifecycleHooks from './lifecycle-hooks';
import setState from './set-state';
import forceUpdate from './force-update';
import componentTask from './middleware';
import { ComponentTreeCache, InstanceCache } from '../util/caches';

const { assign } = Object;

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
let unsubscribe = null;

export default function upgradeClass(Constructor) {
  Constructor.subscribeMiddleware = () => {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = use(componentTask());
  };

  Constructor.unsubscribeMiddleware = () => {
    unsubscribe();
    ComponentTreeCache.clear();
    InstanceCache.clear();
  };

  // Registers a custom middleware to help map the render lifecycle internals
  // to React-like & Custom Element components.
  assign(Constructor.prototype, lifecycleHooks, { setState, forceUpdate });

  // Automatically subscribe the React-like Component middleware.
  Constructor.subscribeMiddleware();

  return Constructor;
}
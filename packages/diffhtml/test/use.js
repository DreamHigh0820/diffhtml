import { equal, throws } from 'assert';
import { html, innerHTML, use, release } from '../lib/index';
import validateMemory from './util/validateMemory';

const { assign } = Object;

describe('Use (Middleware)', function() {
  afterEach(() => validateMemory());

  it('will error if a value is passed that is not a function', () => {
    throws(() => use());
    throws(() => use(null));
    throws(() => use(undefined));
    throws(() => use(0));
    throws(() => use(NaN));
    throws(() => use(false));
    throws(() => use({}));
    throws(() => use([]));
  });

  it('will allow modifying the newTree during sync', () => {
    const oldTree = document.createElement('div');
    const newTree = html`<div class="test" />`;

    const unsubscribe = use(assign(() => {}, {
      syncTreeHook(oldTree, newTree) {
        newTree.attributes['data-track'] = 'some-new-value';
      }
    }));

    innerHTML(oldTree, newTree);

    equal(oldTree.outerHTML, `<div><div class="test" data-track="some-new-value"></div></div>`);

    release(oldTree);
    unsubscribe();
  });
});

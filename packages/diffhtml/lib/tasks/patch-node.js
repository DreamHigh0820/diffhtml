import patchNode from '../node/patch';
import Transaction from '../transaction';
import { CreateNodeHookCache } from '../util/caches';
import { VTree } from '../util/types';

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Transaction} transaction
 * @return {void}
 */
export default function patch(transaction) {
  const { domNode, state, state: { measure, scriptsToExecute }, patches } = transaction;
  /** @type {HTMLElement | DocumentFragment} */
  const { ownerDocument } = (domNode);
  const promises = transaction.promises || [];

  state.ownerDocument = ownerDocument || document;

  // Hook into the Node creation process to find all script tags, and mark them
  // for execution.
  const collectScripts = (/** @type {VTree} */vTree) => {
    if (vTree.nodeName === 'script') {
      scriptsToExecute.set(vTree, vTree.attributes.type);
      vTree.attributes.type = 'no-execute';
    }
  };

  CreateNodeHookCache.add(collectScripts);

  measure('patch node');
  promises.push(...patchNode(patches, state));
  measure('patch node');

  CreateNodeHookCache.delete(collectScripts);

  transaction.promises = promises;
}

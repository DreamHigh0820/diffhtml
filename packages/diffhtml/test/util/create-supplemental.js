import { Supplemental } from '../../lib/util/types';

/**
 * Converts a partial Supplemental object to a full Supplemental object.
 *
 * @param {Partial<Supplemental>} partial
 * @return {Supplemental}
 */
export default function createSupplemental(partial) {
  return {
    tags: {},
    children: {},
    attributes: {},
    ...partial,
  };
}
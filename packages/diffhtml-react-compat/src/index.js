import { createTree, innerHTML, outerHTML, use, html } from 'diffhtml';
import { Component } from 'diffhtml-components';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';
import PropTypes from 'prop-types';

const { keys } = Object;

use(syntheticEvents());

exports.createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = Symbol.for('react.element');

  const attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  attributes.forEach(name => {
    if (name.indexOf('on') === 0) {
      tree.attributes[name.toLowerCase()] = tree.attributes[name];
    }
  });

  return tree;
};

exports.PropTypes = PropTypes;
exports.Component = Component;
exports.html = html;
exports.render = (component, mount) => innerHTML(mount, component, );
exports.isValidElement = function(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === Symbol.for('react.element')
  );
};

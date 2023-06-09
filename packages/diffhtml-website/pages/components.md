# Components

Components are used to organize and reuse common parts of your UI. They can be
defined as either classes or functions. You may register any component as a
Web Component.

<a name="overview"></a>

---

## <a href="#overview">Overview</a>

Components support is provided by a plugin and must be installed and imported
before they will work. The middleware provided by the plugin supports functions,
classes, and web components.

``` sh
npm install --save diffhtml-components
```

<a name="function-component"></a>

---

## <a href="#function-component">Function component</a>

Functions are a simple and powerful way of creating UI components that allow
you to focus on incoming properties and returning markup. They are stateless
and require the parent component to re-render before they will update.

```javascript
import { html, innerHTML } from 'diffhtml';
import 'diffhtml-components';

function MyComponent(props) {
  return html`
    <div>Some prop = ${props.someProp}</div>
  `;
}

innerHTML(document.body, html`<${MyComponent} someProp="value" />`);
```

You can make them stateful though using hooks inspired by React. The currently
available hooks are:

- <a href="#create-state">createState</a>
- <a href="#create-side-effect">createSideEffect</a>



<a name="class-component"></a>

---

## <a href="#class-component">Class Component</a>

The stateful class component, which is used by importing the `Component` class.

```js
import { Component } from 'diffhtml-components';
```

Once you have this base class, you can extend your ES6 class to get access to
sub-tree rendering. A component render result is treated as a fragment, and are
compared with previous results. All top-level elements are tracked and
efficient diffing is applied against the previously rendered contents.

```js
import { innerHTML, html } from 'diffhtml-components';
import { Component } from 'diffhtml-components';

class ListComponent extends Component {
  render({ items }) {
    return html`
      ${items.map(item => html`
        <li>${item}</li>
      `)}
    `;
  }
}

innerHTML(document.body, html`
  <ul>
    <${ListComponent} items=${['List item 1', 'List item 2']} />
  </ul>
`);
```

These components can be registered as Custom Elements, making them Web
Components.

<a name="component-props"></a>

### <a href="#component-props"><u>Props</u></a>

Incoming attribute values which are mapped into a `props` object, `children` is
a special property which is provided that maps to the VTree `childNodes`. You
can access props on `this.props` or in the `render(props) {}` method.

<a name="component-state"></a>

### <a href="#component-state"><u>State</u></a>

A mutable object that can be updated with `setState`. You can also manually
modify this object and call `forceUpdate` to simulate what `setState` does.
This notion of state is what makes a component reactive. Without it, components
only re-render when their parent has rendered.

#### setState

This is the most common way of updating state that is local to a component. You
use it to update the `state` object and trigger a re-render.

#### forceUpdate

Calling this function schedules a re-render of the current component. It is
useful to call this when you know the state has changed and want it reflected.

<a name="lifecycle-hooks"></a>

### <a href="#lifecycle-hooks"><u>Lifecycle hooks</u></a>

The following hooks will be called during the respective mounting and
unmounting flow. You do not need to extend from `Component` to use these hooks.
Simple classes can just define them as methods and they will be called.

#### `componentDidMount`

```js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DidMountComponent extends Component {
  render() {
    return html`
      <div><h1>Hello world</h1></div>
    `;
  }

  componentDidMount() {
    console.log('Component has mounted');
  }
}

innerHTML(document.body, html`<${DidMountComponent} />`);
```

#### `componentDidUpdate`

```js
import { html, innerHTML } from 'diffhtml';
import { Component } from 'diffhtml-components';

class DidUpdateComponent extends Component {
  render() {
    return html`
      <div><h1>Hello world</h1></div>
    `;
  }

  componentDidUpdate() {
    console.log('Component was updated');
  }
}

innerHTML(document.body, html`<${WillMountComponent} />`);
```

#### `componentWillReceiveProps`

This method is triggered whenever a component is about to receive props and
potentially re-render.

#### `shouldComponentUpdate`

This method allows a developer to determine if a component should go through
a re-render cycle or not.

#### `componentWillUnmount`

This method will trigger right before patching occurs and the component is to
be unmounted.

<a name="custom-element"></a>

---

## <a href="#custom-element">Custom Element</a>

You may register any component as a Custom Element using
`customElements.define`. This will allow you to embed components using a more
natural syntax.

```js
import { html } from 'diffhtml';
import { Component } from 'diffhtml-components';

class ClassComponent extends Component {
  render() {
    const { prop } = this.props;

    return html`
      <div>Hello world with prop ${prop}</div>
    `;
  }
}

customElements.define('custom-element', ClassComponent);
```

Class components must use tagged template interpolation:

```js
html`<${ClassComponent} prop=${value} />`
```

Where Custom Elements may be referenced like any other HTML element:

```js
html`<custom-element prop=${value} />`
```

<a name="create-state"></a>

---

## <a href="#create-state">createState</a>

The function `createState` is used to make a function component stateful, which
is the ability to re-render itself. It mimics the API of `useState` from React.

<a name="create-state-examples"></a>

### <a href="#create-state-examples"><u>Examples</u></a>

Simple example demonstrating an incrementing counter.

```javascript
import { innerHTML, html } from 'diffhtml';
import { createState } from 'diffhtml-components';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [ count, setCount ] = createState(0);

  return html`
    <div>
      <p>You clicked ${String(count)} times</p>
      <button onClick=${() => setCount(count + 1)}>Click me</button>
    </div>
  `;
}

innerHTML(main, html`<${Example} />`);
```

<a name="create-side-effect"></a>

---

## <a href="#create-side-effect">createSideEffect</a>

The function `createSideEffect` is used to schedule some work after a component
has mounted, unmounted, or updated. This works similar to the `useEffect` hook
found in React and maps directly to the class lifecycle hooks:
`componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

<a name="create-side-effect-examples"></a>

### <a href="#create-side-effect-examples"><u>Examples</u></a>

```javascript
import { innerHTML, html } from 'diffhtml';
import { createSideEffect } from 'diffhtml-components';

function Example() {
  createSideEffect(() => {
    console.log('Component has mounted');

    return () => {
      console.log('Component has updated');
    };
  }, () => {
    console.log('Component has unmounted');
  });

  return html`
    <div>Hello world</div>
  `;
}

innerHTML(main, html`<${Example} />`);
```

<a name="jsx"></a>

---

## <a href="#jsx">JSX</a>

JSX is supported out-of-the-box. You will need to configure your compiler to
use `createTree`, or alias it to `h` or whatever is expected.

```jsx
import { createTree as h } from 'diffhtml';

function SomeComponent() {
  return (
    <>
      <div>Using JSX</div>
      <span onClick={() => console.log('clicked')}></span>
    </>
  );
}
```

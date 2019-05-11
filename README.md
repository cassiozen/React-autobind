React Class autoBind
=====================

Automatically binds methods defined within a component's Class to the current object's lexical `this` instance (similarly to the default behavior of React.createClass).


### Description

React 0.13 introduced the possibility to define components using plain JavaScript ES6 classes. But differently from the traditional React.createClass, user defined methods in a ES6 class are not automatically bound.

Autobind is an utility function that can be called from the class constructor to bind the class methods to the component instance.

### Installation

To install the stable version:

```
npm install --save react-autobind
```

Then import it:

```javascript
import autoBind from 'react-autobind';
```

### Usage
You will generally call autoBind from the class constructor, passing the 'this' context:

```javascript
constructor(props) {
  super(props);
  autoBind(this);
}
```

Autobind is smart enough to avoid binding React related methods (such as render and lifecycle hooks).

You can also explicitly specify certain methods to exclude from binding:

```javascript
constructor(props) {
  super(props);
  autoBind(this, {
    wontBind: ['leaveAlone1', 'leaveAlone2']
  });
}
```

Or specify the only methods that should be auto-bound:

```javascript
constructor(props) {
  super(props);
  autoBind(this, {
    bindOnly: ['myMethod1', 'myMethod2']
  });
}
```

Naturally, `wontBind` and `bindOnly` cannot be used together.

You can even specify the methods with certain prefix to be autobound:

```javascript
constructor(props) {
  super(props);
  autoBind(this, {
    bindOnlyWithPrefix: 'on'
  });
}
```

This is extremely useful when you follow the standard naming convention of 
prepending `on` infront of all the UI handlers in your component.

This can be easily used with `wontBind` in case, React ever releases any hook which
might have `on` infront:

```javascript
constructor(props) {
  super(props);
  autoBind(this, {
    bindOnlyWithPrefix: 'on',
    wontBind: ['onSomeReactHook']
  });
}
```

### Example

```javascript
import React from 'react';
import {render} from 'react-dom';
import autoBind from 'react-autobind';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      clickCounter: 0
    }
    autoBind(this);
  }

  increment() {
    this.setState({
      clickCounter: this.state.clickCounter + 1
    });
  }

  // React's render and lifecycle hooks aren't bound

  componentDidMount() {
    console.log("Component is mounted.");
  }

  render(){
    return (
      <div>
        <h1>Number of clicks: {this.state.clickCounter}</h1>
        <button onClick={this.increment}>Increment Counter</button>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

```

### Similar Projects

React-autobind is similar (and forks some code from) [Autobind Decorator](https://github.com/andreypopp/autobind-decorator), with two main differences:

1. React-autobind is focused on React, and avoids binding React's Component methods such as `render` and lifecycle hooks.

2. React-autobind is a plain function call, while Autobind Decorator uses a more elegant but still not standardized JavaScript syntax that is subject to change in the future.

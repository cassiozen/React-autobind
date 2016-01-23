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

### Usage
You will generally call autoBind from the class constructor, passing the 'this' context:

```javascript
import autoBind from 'react-autobind';

constructor() {
  super();
  autoBind(this);
}
```

Autobind is smart enough to avoid binding React related methods (such as render and lifecycle hooks).

You can also explicitly specify which methods you want to bind:

```javascript
import autoBind from 'react-autobind';

constructor() {
  super();
  autoBind(this, 'myMethod1', 'myMethod2');
}
```

### Example

```javascript
import React from 'react';
import {render} from 'react-dom';
import autoBind from 'react-autobind';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      clickCounter: 0
    }
    autoBind(this);
  }

  componentDidMount() {
    console.log("Component is mounted");
  }

  increment() {
    this.setState({
      clickCounter: this.state.clickCounter + 1
    });
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

const wontBind = [
  'constructor',
  'render',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

let toBind = [];

export default function autoBind (context) {
  if(context === undefined) {
    console.error('Autobind error: No context provided.');
    return;
  }

  let objPrototype = Object.getPrototypeOf(context);

  if(arguments.length > 1) {
    // If a list of methods to bind is provided, use it.
    toBind = Array.prototype.slice.call(arguments, 1);
  } else {
    // If no list of methods to bind is provided, bind all available methods in class.
    toBind = Object.getOwnPropertyNames(objPrototype);
  }

  toBind.forEach(function(method) {
    let descriptor = Object.getOwnPropertyDescriptor(objPrototype, method);

    if(descriptor === undefined) {
      console.warn(`Autobind: "${method}" method not found in class.`);
      return;
    }

    // Return if it's special case function or if not a function at all
    if(wontBind.indexOf(method) !== -1 || typeof descriptor.value !== 'function') {
      return;
    }

    Object.defineProperty(objPrototype, method, boundMethod(objPrototype, method, descriptor));
  });
}

/**
* From autobind-decorator (https://github.com/andreypopp/autobind-decorator/tree/master)
* Return a descriptor removing the value and returning a getter
* The getter will return a .bind version of the function
* and memoize the result against a symbol on the instance
*/
function boundMethod(objPrototype, method, descriptor) {
  let fn = descriptor.value;

  return {
    configurable: true,
    get() {
      if (this === objPrototype || this.hasOwnProperty(method)) {
        return fn;
      }

      let boundFn = fn.bind(this);
      Object.defineProperty(this, method, {
        value: boundFn,
        configurable: true,
        writable: true
      });
      return boundFn;
    }
  };
}

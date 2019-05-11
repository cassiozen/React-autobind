import assert from 'assert';
import autobind from '../lib/autoBind';

describe("autoBind helper function", function() {

  describe("Binds all methods", function() {

    class A {
      constructor() {
        this.value = 42;
        autobind(this);
      }

      getValue() {
        return this.value;
      }

      render() {
        return this.value;
      }

    }

    it('binds methods to an instance', function() {
      let a = new A();
      let getValue = a.getValue;
      assert(getValue() === 42);
    });

    it('binds method only once', function() {
      let a = new A();
      assert(a.getValue === a.getValue);
    });

    it('does not binds react related methods', function() {
      let a = new A();
      assert.throws(a.render, /TypeError: Cannot read property 'value' of undefined/);
    });

    it('does not override itself when accessed on the prototype', function() {
      A.prototype.getValue;

      let a = new A();
      let getValue = a.getValue;
      assert(getValue() === 42);
    });

    it('should not override binded instance method, while calling super method with the same name', function() {
      class B extends A {
        constructor() {
          super();
          autobind(this);
        }
        getValue() {
          return super.getValue() + 8;
        }
      }

      let b = new B();
      let value = b.getValue();
      value = b.getValue();

      assert(value === 50);
    });

  });


  describe("Binds specific methods", function() {

    class A {
      constructor() {
        this.value = 42;
        autobind(this, {bindOnly: ['getValue']});
      }

      unbound() {
        return this;
      }

      getValue() {
        return this.value;
      }

    }

    it('binds methods to an instance', function() {
      let a = new A();
      let getValue = a.getValue;
      assert(getValue() === 42);
    });

    it('does not bind all methods', function() {
      let a = new A();
      let b = {};
      b.unbound = a.unbound;
      b.bound = a.getValue;
      assert(b.unbound() === b);
      assert(b.bound() === 42);
    });
  });

  describe("Binds methods with specific prefix", function() {

    class A {
      constructor() {
        this.value = 42;
        autobind(this, {bindOnlyWithPrefix: 'on', wontBind: ['onSomeReactHook']});
      }

      onSomeReactHook() {
        return this.value + 20;
      }

      onUpdate(something) {
        return this.value + something;
      }

      getValue() {
        return this.value;
      }
    }

    it('binds methods with specific prefix', function() {
      let a = new A();
      let b = {value: 11};
      b.onUpdate = a.onUpdate;
      b.getValue = a.getValue;
      assert(b.onUpdate(10) === 52);
      assert(b.getValue() === 11);
    });

    it('does not bind a method with specific prefix if its in options.wontBind', function() {
      let a = new A();
      let b = {value: 11};
      b.onSomeReactHook = a.onSomeReactHook;
      b.onUpdate = a.onUpdate;
      assert(b.onSomeReactHook() === 31);
      assert(b.onUpdate(10) === 52);
    });
  });
});

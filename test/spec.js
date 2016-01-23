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
        autobind(this, 'getValue');
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
      b.unbound = a.unbound
      assert(b.unbound() === b);
    });
  });
});

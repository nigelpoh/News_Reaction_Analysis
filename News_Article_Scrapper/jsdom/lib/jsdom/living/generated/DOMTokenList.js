"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;

/**
 * When an interface-module that implements this interface as a mixin is loaded, it will append its own `.is()`
 * method into this array. It allows objects that directly implements *those* interfaces to be recognized as
 * implementing this mixin interface.
 */
exports._mixedIntoPredicates = [];
exports.is = function is(obj) {
  if (obj) {
    if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
      return true;
    }
    for (const isMixedInto of exports._mixedIntoPredicates) {
      if (isMixedInto(obj)) {
        return true;
      }
    }
  }
  return false;
};
exports.isImpl = function isImpl(obj) {
  if (obj) {
    if (obj instanceof Impl.implementation) {
      return true;
    }

    const wrapper = utils.wrapperForImpl(obj);
    for (const isMixedInto of exports._mixedIntoPredicates) {
      if (isMixedInto(wrapper)) {
        return true;
      }
    }
  }
  return false;
};
exports.convert = function convert(obj, { context = "The provided value" } = {}) {
  if (exports.is(obj)) {
    return utils.implForWrapper(obj);
  }
  throw new TypeError(`${context} is not of type 'DOMTokenList'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["DOMTokenList"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor DOMTokenList is not installed on the passed global object");
  }

  let obj = Object.create(ctor.prototype);
  obj = exports.setup(obj, globalObject, constructorArgs, privateData);
  return obj;
};
exports.createImpl = function createImpl(globalObject, constructorArgs, privateData) {
  const obj = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(obj);
};
exports._internalSetup = function _internalSetup(obj) {};
exports.setup = function setup(obj, globalObject, constructorArgs = [], privateData = {}) {
  privateData.wrapper = obj;

  exports._internalSetup(obj);
  Object.defineProperty(obj, impl, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });

  obj = new Proxy(obj, {
    get(target, P, receiver) {
      if (typeof P === "symbol") {
        return Reflect.get(target, P, receiver);
      }
      const desc = this.getOwnPropertyDescriptor(target, P);
      if (desc === undefined) {
        const parent = Object.getPrototypeOf(target);
        if (parent === null) {
          return undefined;
        }
        return Reflect.get(target, P, receiver);
      }
      if (!desc.get && !desc.set) {
        return desc.value;
      }
      const getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return Reflect.apply(getter, receiver, []);
    },

    has(target, P) {
      if (typeof P === "symbol") {
        return Reflect.has(target, P);
      }
      const desc = this.getOwnPropertyDescriptor(target, P);
      if (desc !== undefined) {
        return true;
      }
      const parent = Object.getPrototypeOf(target);
      if (parent !== null) {
        return Reflect.has(parent, P);
      }
      return false;
    },

    ownKeys(target) {
      const keys = new Set();

      for (const key of target[impl][utils.supportedPropertyIndices]) {
        keys.add(`${key}`);
      }

      for (const key of Reflect.ownKeys(target)) {
        keys.add(key);
      }
      return [...keys];
    },

    getOwnPropertyDescriptor(target, P) {
      if (typeof P === "symbol") {
        return Reflect.getOwnPropertyDescriptor(target, P);
      }
      let ignoreNamedProps = false;

      if (utils.isArrayIndexPropName(P)) {
        const index = P >>> 0;
        const indexedValue = target[impl].item(index);
        if (indexedValue !== null) {
          return {
            writable: false,
            enumerable: true,
            configurable: true,
            value: utils.tryWrapperForImpl(indexedValue)
          };
        }
        ignoreNamedProps = true;
      }

      return Reflect.getOwnPropertyDescriptor(target, P);
    },

    set(target, P, V, receiver) {
      if (typeof P === "symbol") {
        return Reflect.set(target, P, V, receiver);
      }
      if (target === receiver) {
        utils.isArrayIndexPropName(P);
      }
      let ownDesc;

      if (utils.isArrayIndexPropName(P)) {
        const index = P >>> 0;
        const indexedValue = target[impl].item(index);
        if (indexedValue !== null) {
          ownDesc = {
            writable: false,
            enumerable: true,
            configurable: true,
            value: utils.tryWrapperForImpl(indexedValue)
          };
        }
      }

      if (ownDesc === undefined) {
        ownDesc = Reflect.getOwnPropertyDescriptor(target, P);
      }
      if (ownDesc === undefined) {
        const parent = Reflect.getPrototypeOf(target);
        if (parent !== null) {
          return Reflect.set(parent, P, V, receiver);
        }
        ownDesc = { writable: true, enumerable: true, configurable: true, value: undefined };
      }
      if (!ownDesc.writable) {
        return false;
      }
      if (!utils.isObject(receiver)) {
        return false;
      }
      const existingDesc = Reflect.getOwnPropertyDescriptor(receiver, P);
      let valueDesc;
      if (existingDesc !== undefined) {
        if (existingDesc.get || existingDesc.set) {
          return false;
        }
        if (!existingDesc.writable) {
          return false;
        }
        valueDesc = { value: V };
      } else {
        valueDesc = { writable: true, enumerable: true, configurable: true, value: V };
      }
      return Reflect.defineProperty(receiver, P, valueDesc);
    },

    defineProperty(target, P, desc) {
      if (typeof P === "symbol") {
        return Reflect.defineProperty(target, P, desc);
      }

      if (utils.isArrayIndexPropName(P)) {
        return false;
      }

      return Reflect.defineProperty(target, P, desc);
    },

    deleteProperty(target, P) {
      if (typeof P === "symbol") {
        return Reflect.deleteProperty(target, P);
      }

      if (utils.isArrayIndexPropName(P)) {
        const index = P >>> 0;
        return !(target[impl].item(index) !== null);
      }

      return Reflect.deleteProperty(target, P);
    },

    preventExtensions() {
      return false;
    }
  });

  obj[impl][utils.wrapperSymbol] = obj;
  if (Impl.init) {
    Impl.init(obj[impl], privateData);
  }
  return obj;
};

exports.install = function install(globalObject) {
  class DOMTokenList {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    item(index) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'item' on 'DOMTokenList': 1 argument required, but only " + arguments.length + " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["unsigned long"](curArg, {
          context: "Failed to execute 'item' on 'DOMTokenList': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].item(...args);
    }

    contains(token) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'contains' on 'DOMTokenList': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'contains' on 'DOMTokenList': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].contains(...args);
    }

    add() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'add' on 'DOMTokenList': parameter " + (i + 1)
        });
        args.push(curArg);
      }
      return this[impl].add(...args);
    }

    remove() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length; i++) {
        let curArg = arguments[i];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'remove' on 'DOMTokenList': parameter " + (i + 1)
        });
        args.push(curArg);
      }
      return this[impl].remove(...args);
    }

    toggle(token) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'toggle' on 'DOMTokenList': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'toggle' on 'DOMTokenList': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["boolean"](curArg, {
            context: "Failed to execute 'toggle' on 'DOMTokenList': parameter 2"
          });
        }
        args.push(curArg);
      }
      return this[impl].toggle(...args);
    }

    replace(token, newToken) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'replace' on 'DOMTokenList': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'replace' on 'DOMTokenList': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'replace' on 'DOMTokenList': parameter 2"
        });
        args.push(curArg);
      }
      return this[impl].replace(...args);
    }

    supports(token) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'supports' on 'DOMTokenList': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'supports' on 'DOMTokenList': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].supports(...args);
    }

    get length() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["length"];
    }

    get value() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["value"];
    }

    set value(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'value' property on 'DOMTokenList': The provided value"
      });

      this[impl]["value"] = V;
    }

    toString() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this[impl]["value"];
    }
  }
  Object.defineProperties(DOMTokenList.prototype, {
    item: { enumerable: true },
    contains: { enumerable: true },
    add: { enumerable: true },
    remove: { enumerable: true },
    toggle: { enumerable: true },
    replace: { enumerable: true },
    supports: { enumerable: true },
    length: { enumerable: true },
    value: { enumerable: true },
    toString: { enumerable: true },
    [Symbol.toStringTag]: { value: "DOMTokenList", configurable: true },
    [Symbol.iterator]: { value: Array.prototype[Symbol.iterator], configurable: true, writable: true },
    keys: { value: Array.prototype.keys, configurable: true, enumerable: true, writable: true },
    values: { value: Array.prototype[Symbol.iterator], configurable: true, enumerable: true, writable: true },
    entries: { value: Array.prototype.entries, configurable: true, enumerable: true, writable: true },
    forEach: { value: Array.prototype.forEach, configurable: true, enumerable: true, writable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["DOMTokenList"] = DOMTokenList;

  Object.defineProperty(globalObject, "DOMTokenList", {
    configurable: true,
    writable: true,
    value: DOMTokenList
  });
};

const Impl = require("../nodes/DOMTokenList-impl.js");

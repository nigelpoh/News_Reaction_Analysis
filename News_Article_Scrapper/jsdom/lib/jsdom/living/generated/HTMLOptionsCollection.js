"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const isHTMLOptionElement = require("./HTMLOptionElement.js").is;
const isHTMLOptGroupElement = require("./HTMLOptGroupElement.js").is;
const isHTMLElement = require("./HTMLElement.js").is;
const convertHTMLOptionElement = require("./HTMLOptionElement.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const HTMLCollection = require("./HTMLCollection.js");

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
  throw new TypeError(`${context} is not of type 'HTMLOptionsCollection'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLOptionsCollection"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLOptionsCollection is not installed on the passed global object");
  }

  let obj = Object.create(ctor.prototype);
  obj = exports.setup(obj, globalObject, constructorArgs, privateData);
  return obj;
};
exports.createImpl = function createImpl(globalObject, constructorArgs, privateData) {
  const obj = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(obj);
};
exports._internalSetup = function _internalSetup(obj) {
  HTMLCollection._internalSetup(obj);
};
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

      for (const key of target[impl][utils.supportedPropertyNames]) {
        if (!(key in target)) {
          keys.add(`${key}`);
        }
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
            writable: true,
            enumerable: true,
            configurable: true,
            value: utils.tryWrapperForImpl(indexedValue)
          };
        }
        ignoreNamedProps = true;
      }

      const namedValue = target[impl].namedItem(P);

      if (namedValue !== null && !(P in target) && !ignoreNamedProps) {
        return {
          writable: false,
          enumerable: true,
          configurable: true,
          value: utils.tryWrapperForImpl(namedValue)
        };
      }

      return Reflect.getOwnPropertyDescriptor(target, P);
    },

    set(target, P, V, receiver) {
      if (typeof P === "symbol") {
        return Reflect.set(target, P, V, receiver);
      }
      if (target === receiver) {
        if (utils.isArrayIndexPropName(P)) {
          const index = P >>> 0;
          let indexedValue = V;

          if (indexedValue === null || indexedValue === undefined) {
            indexedValue = null;
          } else {
            indexedValue = convertHTMLOptionElement(indexedValue, {
              context: "Failed to set the " + index + " property on 'HTMLOptionsCollection': The provided value"
            });
          }

          const creating = !(target[impl].item(index) !== null);
          if (creating) {
            target[impl][utils.indexedSetNew](index, indexedValue);
          } else {
            target[impl][utils.indexedSetExisting](index, indexedValue);
          }

          return true;
        }

        typeof P === "string" && !utils.isArrayIndexPropName(P);
      }
      let ownDesc;

      if (utils.isArrayIndexPropName(P)) {
        const index = P >>> 0;
        const indexedValue = target[impl].item(index);
        if (indexedValue !== null) {
          ownDesc = {
            writable: true,
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
        if (desc.get || desc.set) {
          return false;
        }

        const index = P >>> 0;
        let indexedValue = desc.value;

        if (indexedValue === null || indexedValue === undefined) {
          indexedValue = null;
        } else {
          indexedValue = convertHTMLOptionElement(indexedValue, {
            context: "Failed to set the " + index + " property on 'HTMLOptionsCollection': The provided value"
          });
        }

        const creating = !(target[impl].item(index) !== null);
        if (creating) {
          target[impl][utils.indexedSetNew](index, indexedValue);
        } else {
          target[impl][utils.indexedSetExisting](index, indexedValue);
        }

        return true;
      }
      if (!utils.hasOwn(target, P)) {
        const creating = !(target[impl].namedItem(P) !== null);
        if (!creating) {
          return false;
        }
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

      if (target[impl].namedItem(P) !== null && !(P in target)) {
        return false;
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
  if (globalObject.HTMLCollection === undefined) {
    throw new Error("Internal error: attempting to evaluate HTMLOptionsCollection before HTMLCollection");
  }
  class HTMLOptionsCollection extends globalObject.HTMLCollection {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    add(element) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'add' on 'HTMLOptionsCollection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (isHTMLOptionElement(curArg) || isHTMLOptGroupElement(curArg)) {
          curArg = utils.implForWrapper(curArg);
        } else {
          throw new TypeError(
            "Failed to execute 'add' on 'HTMLOptionsCollection': parameter 1" + " is not of any supported type."
          );
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          if (curArg === null || curArg === undefined) {
            curArg = null;
          } else {
            if (isHTMLElement(curArg)) {
              curArg = utils.implForWrapper(curArg);
            } else if (typeof curArg === "number") {
              curArg = conversions["long"](curArg, {
                context: "Failed to execute 'add' on 'HTMLOptionsCollection': parameter 2"
              });
            } else {
              curArg = conversions["long"](curArg, {
                context: "Failed to execute 'add' on 'HTMLOptionsCollection': parameter 2"
              });
            }
          }
        } else {
          curArg = null;
        }
        args.push(curArg);
      }
      return this[impl].add(...args);
    }

    remove(index) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 1) {
        throw new TypeError(
          "Failed to execute 'remove' on 'HTMLOptionsCollection': 1 argument required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["long"](curArg, {
          context: "Failed to execute 'remove' on 'HTMLOptionsCollection': parameter 1"
        });
        args.push(curArg);
      }
      return this[impl].remove(...args);
    }

    get length() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["length"];
    }

    set length(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["unsigned long"](V, {
        context: "Failed to set the 'length' property on 'HTMLOptionsCollection': The provided value"
      });

      this[impl]["length"] = V;
    }

    get selectedIndex() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["selectedIndex"];
    }

    set selectedIndex(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["long"](V, {
        context: "Failed to set the 'selectedIndex' property on 'HTMLOptionsCollection': The provided value"
      });

      this[impl]["selectedIndex"] = V;
    }
  }
  Object.defineProperties(HTMLOptionsCollection.prototype, {
    add: { enumerable: true },
    remove: { enumerable: true },
    length: { enumerable: true },
    selectedIndex: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLOptionsCollection", configurable: true },
    [Symbol.iterator]: { value: Array.prototype[Symbol.iterator], configurable: true, writable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLOptionsCollection"] = HTMLOptionsCollection;

  Object.defineProperty(globalObject, "HTMLOptionsCollection", {
    configurable: true,
    writable: true,
    value: HTMLOptionsCollection
  });
};

const Impl = require("../nodes/HTMLOptionsCollection-impl.js");

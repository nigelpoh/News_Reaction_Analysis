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
  throw new TypeError(`${context} is not of type 'NodeIterator'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["NodeIterator"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor NodeIterator is not installed on the passed global object");
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

  obj[impl][utils.wrapperSymbol] = obj;
  if (Impl.init) {
    Impl.init(obj[impl], privateData);
  }
  return obj;
};

exports.install = function install(globalObject) {
  class NodeIterator {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    nextNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].nextNode());
    }

    previousNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl].previousNode());
    }

    detach() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].detach();
    }

    get root() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "root", () => {
        return utils.tryWrapperForImpl(this[impl]["root"]);
      });
    }

    get referenceNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["referenceNode"]);
    }

    get pointerBeforeReferenceNode() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["pointerBeforeReferenceNode"];
    }

    get whatToShow() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["whatToShow"];
    }

    get filter() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.tryWrapperForImpl(this[impl]["filter"]);
    }
  }
  Object.defineProperties(NodeIterator.prototype, {
    nextNode: { enumerable: true },
    previousNode: { enumerable: true },
    detach: { enumerable: true },
    root: { enumerable: true },
    referenceNode: { enumerable: true },
    pointerBeforeReferenceNode: { enumerable: true },
    whatToShow: { enumerable: true },
    filter: { enumerable: true },
    [Symbol.toStringTag]: { value: "NodeIterator", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["NodeIterator"] = NodeIterator;

  Object.defineProperty(globalObject, "NodeIterator", {
    configurable: true,
    writable: true,
    value: NodeIterator
  });
};

const Impl = require("../traversal/NodeIterator-impl.js");

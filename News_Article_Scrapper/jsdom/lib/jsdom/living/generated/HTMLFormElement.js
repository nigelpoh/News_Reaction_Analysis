"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertHTMLElement = require("./HTMLElement.js").convert;
const impl = utils.implSymbol;
const ctorRegistry = utils.ctorRegistrySymbol;
const HTMLElement = require("./HTMLElement.js");

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
  throw new TypeError(`${context} is not of type 'HTMLFormElement'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["HTMLFormElement"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor HTMLFormElement is not installed on the passed global object");
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
  HTMLElement._internalSetup(obj);
};
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
  if (globalObject.HTMLElement === undefined) {
    throw new Error("Internal error: attempting to evaluate HTMLFormElement before HTMLElement");
  }
  class HTMLFormElement extends globalObject.HTMLElement {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    submit() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].submit();
    }

    requestSubmit() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = convertHTMLElement(curArg, {
            context: "Failed to execute 'requestSubmit' on 'HTMLFormElement': parameter 1"
          });
        }
        args.push(curArg);
      }
      return this[impl].requestSubmit(...args);
    }

    reset() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].reset();
    }

    checkValidity() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].checkValidity();
    }

    reportValidity() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].reportValidity();
    }

    get acceptCharset() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "accept-charset");
      return value === null ? "" : value;
    }

    set acceptCharset(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'acceptCharset' property on 'HTMLFormElement': The provided value"
      });

      this[impl].setAttributeNS(null, "accept-charset", V);
    }

    get action() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["action"];
    }

    set action(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'action' property on 'HTMLFormElement': The provided value"
      });

      this[impl]["action"] = V;
    }

    get enctype() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["enctype"];
    }

    set enctype(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'enctype' property on 'HTMLFormElement': The provided value"
      });

      this[impl]["enctype"] = V;
    }

    get method() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["method"];
    }

    set method(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'method' property on 'HTMLFormElement': The provided value"
      });

      this[impl]["method"] = V;
    }

    get name() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "name");
      return value === null ? "" : value;
    }

    set name(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'name' property on 'HTMLFormElement': The provided value"
      });

      this[impl].setAttributeNS(null, "name", V);
    }

    get noValidate() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasAttributeNS(null, "novalidate");
    }

    set noValidate(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["boolean"](V, {
        context: "Failed to set the 'noValidate' property on 'HTMLFormElement': The provided value"
      });

      if (V) {
        this[impl].setAttributeNS(null, "novalidate", "");
      } else {
        this[impl].removeAttributeNS(null, "novalidate");
      }
    }

    get target() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      const value = this[impl].getAttributeNS(null, "target");
      return value === null ? "" : value;
    }

    set target(V) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      V = conversions["DOMString"](V, {
        context: "Failed to set the 'target' property on 'HTMLFormElement': The provided value"
      });

      this[impl].setAttributeNS(null, "target", V);
    }

    get elements() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return utils.getSameObject(this, "elements", () => {
        return utils.tryWrapperForImpl(this[impl]["elements"]);
      });
    }

    get length() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl]["length"];
    }
  }
  Object.defineProperties(HTMLFormElement.prototype, {
    submit: { enumerable: true },
    requestSubmit: { enumerable: true },
    reset: { enumerable: true },
    checkValidity: { enumerable: true },
    reportValidity: { enumerable: true },
    acceptCharset: { enumerable: true },
    action: { enumerable: true },
    enctype: { enumerable: true },
    method: { enumerable: true },
    name: { enumerable: true },
    noValidate: { enumerable: true },
    target: { enumerable: true },
    elements: { enumerable: true },
    length: { enumerable: true },
    [Symbol.toStringTag]: { value: "HTMLFormElement", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["HTMLFormElement"] = HTMLFormElement;

  Object.defineProperty(globalObject, "HTMLFormElement", {
    configurable: true,
    writable: true,
    value: HTMLFormElement
  });
};

const Impl = require("../nodes/HTMLFormElement-impl.js");

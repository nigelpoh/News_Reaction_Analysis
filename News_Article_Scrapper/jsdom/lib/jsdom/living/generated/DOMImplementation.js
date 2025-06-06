"use strict";

const conversions = require("webidl-conversions");
const utils = require("./utils.js");

const convertDocumentType = require("./DocumentType.js").convert;
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
  throw new TypeError(`${context} is not of type 'DOMImplementation'.`);
};

exports.create = function create(globalObject, constructorArgs, privateData) {
  if (globalObject[ctorRegistry] === undefined) {
    throw new Error("Internal error: invalid global object");
  }

  const ctor = globalObject[ctorRegistry]["DOMImplementation"];
  if (ctor === undefined) {
    throw new Error("Internal error: constructor DOMImplementation is not installed on the passed global object");
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
  class DOMImplementation {
    constructor() {
      throw new TypeError("Illegal constructor");
    }

    createDocumentType(qualifiedName, publicId, systemId) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 3) {
        throw new TypeError(
          "Failed to execute 'createDocumentType' on 'DOMImplementation': 3 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'createDocumentType' on 'DOMImplementation': parameter 1"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'createDocumentType' on 'DOMImplementation': parameter 2"
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'createDocumentType' on 'DOMImplementation': parameter 3"
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].createDocumentType(...args));
    }

    createDocument(namespace, qualifiedName) {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      if (arguments.length < 2) {
        throw new TypeError(
          "Failed to execute 'createDocument' on 'DOMImplementation': 2 arguments required, but only " +
            arguments.length +
            " present."
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg === null || curArg === undefined) {
          curArg = null;
        } else {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'createDocument' on 'DOMImplementation': parameter 1"
          });
        }
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["DOMString"](curArg, {
          context: "Failed to execute 'createDocument' on 'DOMImplementation': parameter 2",
          treatNullAsEmptyString: true
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[2];
        if (curArg !== undefined) {
          if (curArg === null || curArg === undefined) {
            curArg = null;
          } else {
            curArg = convertDocumentType(curArg, {
              context: "Failed to execute 'createDocument' on 'DOMImplementation': parameter 3"
            });
          }
        } else {
          curArg = null;
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].createDocument(...args));
    }

    createHTMLDocument() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          curArg = conversions["DOMString"](curArg, {
            context: "Failed to execute 'createHTMLDocument' on 'DOMImplementation': parameter 1"
          });
        }
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(this[impl].createHTMLDocument(...args));
    }

    hasFeature() {
      if (!this || !exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }

      return this[impl].hasFeature();
    }
  }
  Object.defineProperties(DOMImplementation.prototype, {
    createDocumentType: { enumerable: true },
    createDocument: { enumerable: true },
    createHTMLDocument: { enumerable: true },
    hasFeature: { enumerable: true },
    [Symbol.toStringTag]: { value: "DOMImplementation", configurable: true }
  });
  if (globalObject[ctorRegistry] === undefined) {
    globalObject[ctorRegistry] = Object.create(null);
  }
  globalObject[ctorRegistry]["DOMImplementation"] = DOMImplementation;

  Object.defineProperty(globalObject, "DOMImplementation", {
    configurable: true,
    writable: true,
    value: DOMImplementation
  });
};

const Impl = require("../nodes/DOMImplementation-impl.js");

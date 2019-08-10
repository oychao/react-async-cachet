/* eslint-disable no-param-reassign, func-names */

function latentSet(target, key, value, descriptor = {}) {
  Object.defineProperty(target, key, {
    ...descriptor,
    value
  });
}

function puissantAssign(target, source) {
  const keys = Object.getOwnPropertyNames(source);
  keys.forEach((key) => {
    if (!['length', 'name'].includes(key)) {
      target[key] = source[key];
    }
  });
}

const FLAG = Symbol('REACT_ASYNC_CACHET_FLAG');

export function cachet(prototype, prop, descriptor) {
  // hijack raw promise
  let inst;
  const RawPromise = global.Promise;
  const HijackedPromise = (...args) => {
    const firstArg = args[0];
    args[0] = (res, rej) => {
      firstArg((...args2) => {
        if (inst && HijackedPromise === global.Promise) {
          rej('hijack');
        }
        res(...args2);
      }, rej);
    };
    return new RawPromise(...args);
  };
  puissantAssign(HijackedPromise, RawPromise);


  // to ensure life methods will be wrapped only once
  if (!prototype[FLAG]) {
    // set flag
    latentSet(prototype, FLAG, true, { writtable: false });

    // wrap componentWillUnmount
    const wrappedComponentWillUnmount = prototype.componentWillUnmount;
    const componentWillUnmountDesc = Object.getOwnPropertyDescriptor(prototype, 'wrappedComponentWillUnmount');
    latentSet(prototype, 'componentWillUnmount', function (...args) {
      inst = this;
      wrappedComponentWillUnmount.call(this, ...args);
    }, componentWillUnmountDesc);
  }

  // wrap target method
  const wrappedTargetMethod = prototype[prop];
  latentSet(prototype, prop, async function (...args) {
    global.Promise = HijackedPromise;
    await wrappedTargetMethod.call(this, ...args);
    global.Promise = RawPromise;
  }, descriptor);
}

export default cachet;

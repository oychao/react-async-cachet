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
const ERR = Symbol('REACT_ASYNC_CACHET_ERR');

const RawPromise = global.Promise;
const instMap = new WeakMap();

export function cachet(prototype, prop, descriptor) {
  // to ensure life methods will be wrapped only once
  if (!prototype[FLAG]) {
    // set flag
    latentSet(prototype, FLAG, true, { writtable: false });

    // wrap componentWillUnmount
    const wrappedComponentWillUnmount = prototype.componentWillUnmount;
    const componentWillUnmountDesc = Object.getOwnPropertyDescriptor(prototype, 'componentWillUnmount');
    latentSet(prototype, 'componentWillUnmount', function (...args) {
      // mark current component instance as unmounted
      instMap.set(this, true);
      if (wrappedComponentWillUnmount) {
        wrappedComponentWillUnmount.call(this, ...args);
      }
    }, componentWillUnmountDesc);
  }

  // wrap target method
  const wrappedTargetMethod = prototype[prop];
  descriptor.value = async function (...args) {
    // hijack raw promise
    const HijackedPromise = (...promiseArgs) => {
      const firstArg = promiseArgs[0];
      promiseArgs[0] = (res, rej) => {
        firstArg((...promiseConstuctorArgs) => {
          if (instMap.has(this) && HijackedPromise === global.Promise) {
            rej(ERR);
          }
          res(...promiseConstuctorArgs);
        }, rej);
      };
      return new RawPromise(...promiseArgs);
    };
    puissantAssign(HijackedPromise, RawPromise);

    global.Promise = HijackedPromise;
    try {
      await wrappedTargetMethod.call(this, ...args);
    } catch (err) {
      if (ERR !== err) {
        throw err;
      }
    }
    global.Promise = RawPromise;
  };
  return descriptor;
}

export default cachet;

export default function List(...arr) {
  if (arr.length === 1 && Array.isArray(arr[0])) {
    arr = arr[0];
  }
  return new Proxy(arr, {
    get(target, property, receiver) {
      switch (property) {
        case 'push':
          return (...args) => new Proxy([...target, ...args], this);
        case 'pop':
          return () => new Proxy(target.slice(0, target.length - 1), this);
        case 'shift':
          return () => new Proxy(target.slice(1, target.length), this);
        case 'unshift':
          return (...args) => new Proxy([...args, ...target], this);
        case 'fill':
        case 'sort':
        case 'reverse':
          return (...args) =>
            new Proxy(Array.from(target)[property](...args), this);
        case 'concat':
        case 'filter':
        case 'map':
        case 'slice':
        case 'flat':
        case 'flatMap':
          return arg => new Proxy(target[property](arg), this);
        case 'splice':
          return (...args) => {
            const copy = Array.from(target);
            copy.splice(...args);
            return copy;
          };
        default:
          return Reflect.get(target, property, receiver);
      }
    },
    set() {
      throw new Error('Tried to change a value on an immutable list');
    },
  });
}
